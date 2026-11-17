import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

const POLL_MS = 30000;

export default function useNotifications() {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await api.get("/api/notifications/unread-count");
      setUnread(res.data.count);
    } catch {
      // a failed poll shouldn't break the navbar
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/notifications?page=0&size=10");
      setItems(res.data);
    } catch {
      // keep the old list
    } finally {
      setLoading(false);
    }
  }, []);

  // poll the badge count, but only while the tab is visible
  useEffect(() => {
    fetchUnread();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchUnread();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchUnread]);

  const markRead = useCallback(
    async (n) => {
      if (n.read) return;
      // optimistic update: UI changes first, server confirms after
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnread((c) => Math.max(0, c - 1));
      try {
        await api.patch(`/api/notifications/${n.id}/read`);
      } catch {
        fetchUnread();
        fetchList(); // roll back to server truth
      }
    },
    [fetchUnread, fetchList]
  );

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnread(0);
    try {
      await api.patch("/api/notifications/read-all");
    } catch {
      fetchUnread();
      fetchList();
    }
  }, [fetchUnread, fetchList]);

  return { unread, items, loading, fetchList, markRead, markAllRead };
}