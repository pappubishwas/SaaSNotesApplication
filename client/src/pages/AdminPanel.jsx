import React, { useState } from "react";
import api, { upgradeTenant } from "../services/api";

export default function AdminPanel({ me }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteStatus, setInviteStatus] = useState("");
  const [upgradeStatus, setUpgradeStatus] = useState("");

  if (me === null) {
    return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
    </div>
    );
  }

  if (me.role !== "admin") {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl">
        Access denied. Admins only.
      </div>
    );
  }

  async function handleInvite(e) {
    e.preventDefault();
    setInviteStatus("");
    try {
      const res = await api.post("/invite", {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteStatus({
        type: "success",
        message: `Invited ${res.data.email} as ${res.data.role}`,
      });
      setInviteEmail("");
    } catch (err) {
      setInviteStatus({
        type: "error",
        message: err.response?.data?.error || "Error inviting user",
      });
    }
  }

  async function handleUpgrade() {
    setUpgradeStatus("");
    try {
      await upgradeTenant(me.tenant);
      setUpgradeStatus({
        type: "success",
        message: "Subscription upgraded to Pro!",
      });
    } catch (err) {
      setUpgradeStatus({
        type: "error",
        message: err.response?.data?.error || "Upgrade failed",
      });
    }
  }

  function StatusMessage({ status }) {
    if (!status) return null;
    return (
      <div
        className={`mt-3 p-2 rounded-lg text-sm ${
          status.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        {status.message}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Admin Panel</h2>

      {/* Add Users */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-slate-700">
          Add Team Members
        </h3>
        <form
          onSubmit={handleInvite}
          className="flex flex-col md:flex-row gap-3 items-stretch"
        >
          <input
            type="email"
            placeholder="Enter member email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition"
          >
            Invite
          </button>
        </form>
        <StatusMessage status={inviteStatus} />
      </section>

      {/* Upgrade Subscription */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-slate-700">
          Upgrade Subscription
        </h3>
        <button
          onClick={handleUpgrade}
          disabled={me?.tenantInfo?.plan === "pro"}
          className={`px-4 py-2 rounded-lg shadow transition ${
            me?.tenantInfo?.plan === "pro"
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {me?.tenantInfo?.plan === "pro" ? "Already Pro" : "Upgrade to Pro"}
        </button>
        <StatusMessage status={upgradeStatus} />
      </section>
    </div>
  );
}
