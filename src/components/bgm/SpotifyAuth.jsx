import { useState, useEffect } from "react";
import SpotifyPlaylistSearch from "./SpotifyPlaylistSearch";

const SpotifyAuth = () => {
  const [token, setToken] = useState("");
  const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectURI = "http://localhost:5173/"; // Gantilah dengan URI yang diizinkan
  const scopes = "user-read-private user-read-email"; // Gantilah dengan cakupan yang sesuai
  const spotifyAPI = "https://api.spotify.com/v1/me";
  // Fungsi untuk mengirim pengguna ke halaman otorisasi Spotify
  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes}&response_type=token`;
  };

  // Fungsi untuk menangani token akses setelah pengguna memberikan izin
  // eslint-disable-next-line no-unused-vars
  const handleTokenResponse = () => {
    const hashParams = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key] = value;
        return acc;
      }, {});
  
    const accessToken = hashParams.access_token;
  
    // Simpan token di localStorage
    localStorage.setItem('spotifyAccessToken', accessToken);
  
    // // Bersihkan hash URL
    // window.history.replaceState({}, document.title, window.location.pathname);
  
    setToken(accessToken);
  };
  

  // Fungsi untuk mengambil data pengguna dari Spotify API
  const fetchUserData = async () => {
    if (token) {
      try {
        const response = await fetch(spotifyAPI, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Data Pengguna Spotify:", data);
        } else {
          console.error("Gagal mengambil data pengguna:", response.statusText);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    }
  };

  // Gunakan useEffect untuk memanggil fetchUserData setelah komponen di-render
  useEffect(() => {
    handleTokenResponse();
    fetchUserData();
  }, [token]);

  return (
    <div>
      {!token ? (
        <button onClick={handleLogin}>Login ke Spotify</button>
      ) : (
        <div>
          <p>Anda telah berhasil login!</p>
          <SpotifyPlaylistSearch />
        </div>
      )}
    </div>
  );
};

export default SpotifyAuth;
