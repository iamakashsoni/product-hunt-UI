import { ref } from "vue";

const user = ref<{ name: string } | null>(null);

export function useAuth() {
  function setUser(newUser: { name: string } | null) {
    user.value = newUser;
  }

  function loadUserFromStorage() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        user.value = JSON.parse(userData);
      } catch {
        user.value = null;
      }
    } else {
      user.value = null;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    user.value = null;
  }

  return {
    user,
    setUser,
    loadUserFromStorage,
    logout,
  };
}
