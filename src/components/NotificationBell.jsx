import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../hooks/useNotifications";

function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { unread, items, loading, fetchList, markRead, markAllRead } = useNotifications();

  // close when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    if (!open) fetchList(); // load the list only when opened
    setOpen((o) => !o);
  };

  const handleClick = (n) => {
    markRead(n);
    setOpen(false);
    navigate("/my-applications");
  };

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-btn" onClick={toggle} aria-label="Notifications">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button className="notif-link" onClick={markAllRead}>Mark all as read</button>
            )}
          </div>

          {loading && items.length === 0 && <p className="notif-empty">Loading...</p>}
          {!loading && items.length === 0 && <p className="notif-empty">No notifications yet</p>}

          {items.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? "" : "unread"}`}
              onClick={() => handleClick(n)}
            >
              <div className="notif-title">{n.title}</div>
              <div className="notif-msg">{n.message}</div>
              <div className="notif-time">{timeAgo(n.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}  