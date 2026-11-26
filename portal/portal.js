// Mentis Veritas portal (AL-60). Sign-in is email and password, then a six-digit authenticator code, every time.
// Nothing here decides access: the database returns only the rows a role may see, and only to a session that
// passed the code (aal2). This page just shows them.
(function () {
  "use strict";
  const cfg = window.MV_PORTAL || {};
  const $ = (id) => document.getElementById(id);
  const VIEWS = ["closed", "signin", "enroll", "verify", "password", "home"];
  const IDLE_MS = 30 * 60 * 1000;
  const ROLE_NAMES = { owner: "Owner", admin: "Admin", staff: "Team", client: "Client", pending: "Access being set up" };

  function show(name) {
    VIEWS.forEach((v) => { $("v-" + v).hidden = v !== name; });
    $("signout").hidden = name === "closed" || name === "signin";
    const first = document.querySelector("#v-" + name + " input");
    if (first) first.focus();
  }
  function say(text, ok) { $("msg").textContent = text || ""; $("msg").className = "msg" + (ok ? " ok" : ""); }
  function busy(form, on) { form.querySelectorAll("button").forEach((b) => { b.disabled = on; }); }

  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) { show("closed"); return; }

  // An invite or reset link lands here with its type in the address; read it before the client clears it.
  const linkType = new URLSearchParams(location.hash.slice(1)).get("type") || "";
  let needPassword = linkType === "invite" || linkType === "recovery";
  let factorId = "";

  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { storage: window.sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  sb.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") needPassword = true; });

  async function route() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return show("signin");
    const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aal || aal.currentLevel !== "aal2") {
      const { data: f } = await sb.auth.mfa.listFactors();
      const verified = ((f && f.totp) || []).find((x) => x.status === "verified");
      if (verified) { factorId = verified.id; return show("verify"); }
      return enroll();
    }
    if (needPassword) return show("password");
    return home();
  }

  async function enroll() {
    const { data: f } = await sb.auth.mfa.listFactors();
    for (const x of ((f && f.all) || []).filter((x) => x.status === "unverified")) {
      await sb.auth.mfa.unenroll({ factorId: x.id });   // a half-finished setup from an earlier visit
    }
    const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator" });
    if (error) { say("Could not start the authenticator setup. Try again."); return show("signin"); }
    factorId = data.id;
    $("qr").src = data.totp.qr_code;
    $("secret").textContent = data.totp.secret;
    show("enroll");
  }

  async function verify(code, form) {
    busy(form, true); say("");
    const { error } = await sb.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    busy(form, false);
    if (error) { say("That code did not work. Wait for the next one and try again."); return; }
    form.reset();
    route();
  }

  async function home() {
    const { data: { user } } = await sb.auth.getUser();
    const [{ data: profile }, { data: links, error }] = await Promise.all([
      sb.from("portal_profiles").select("role, display_name").eq("id", user.id).maybeSingle(),
      sb.from("portal_links").select("title, url, note").order("sort", { ascending: true }),
    ]);
    const role = (profile && profile.role) || "pending";
    $("hello").textContent = profile && profile.display_name ? `Welcome, ${profile.display_name}.` : "Welcome.";
    $("role").textContent = ROLE_NAMES[role] || role;
    const list = $("links");
    list.textContent = "";
    (error ? [] : links || []).forEach((l) => {
      if (!/^https:\/\//i.test(l.url || "")) return;   // only https links are shown
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l.url; a.textContent = l.title; a.rel = "noopener noreferrer"; a.target = "_blank";
      li.appendChild(a);
      if (l.note) { const n = document.createElement("span"); n.className = "note"; n.textContent = l.note; li.appendChild(n); }
      list.appendChild(li);
    });
    $("empty").hidden = list.children.length > 0;
    if (!sessionStorage.getItem("mv_logged")) {
      sessionStorage.setItem("mv_logged", "1");
      sb.rpc("portal_log", { p_action: "sign_in", p_detail: "" }).then(() => {}, () => {});
    }
    show("home");
  }

  $("f-signin").addEventListener("submit", async (e) => {
    e.preventDefault(); say(""); busy(e.target, true);
    const { error } = await sb.auth.signInWithPassword({ email: $("email").value.trim(), password: $("password").value });
    busy(e.target, false);
    $("password").value = "";
    if (error) { say("Email or password not accepted."); return; }
    route();
  });
  $("forgot").addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) { say("Enter your email first."); $("email").focus(); return; }
    await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/portal/" });
    say("If that email has an account, a link is on its way.", true);
  });
  $("f-enroll").addEventListener("submit", (e) => { e.preventDefault(); verify($("enroll-code").value, e.target); });
  $("f-verify").addEventListener("submit", (e) => { e.preventDefault(); verify($("verify-code").value, e.target); });
  $("f-password").addEventListener("submit", async (e) => {
    e.preventDefault(); say("");
    const a = $("new-password").value, b = $("new-password-2").value;
    if (a.length < 12) { say("Twelve characters or more."); return; }
    if (a !== b) { say("The two passwords differ."); return; }
    busy(e.target, true);
    const { error } = await sb.auth.updateUser({ password: a });
    busy(e.target, false);
    e.target.reset();
    if (error) { say("Could not save the password. Try again."); return; }
    needPassword = false;
    say("Password saved.", true);
    route();
  });
  $("signout").addEventListener("click", async () => {
    await sb.auth.signOut();
    sessionStorage.clear();
    location.replace(location.pathname);
  });

  // Signed out after 30 minutes without a click or a key.
  let idle;
  const touch = () => { clearTimeout(idle); idle = setTimeout(() => { if (!$("signout").hidden) $("signout").click(); }, IDLE_MS); };
  ["click", "keydown", "touchstart"].forEach((t) => document.addEventListener(t, touch, { passive: true }));
  touch();

  route().catch(() => { say("The portal did not answer. Try again in a moment."); show("signin"); });
})();
