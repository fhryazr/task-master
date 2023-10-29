import { useState, useEffect } from "react";

const SpotifyPlaylistSearch = () => {
  const [urlInput, setUrlInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState(""); // Token akses Spotify

  const spotifyAPI = "https://api.spotify.com/v1/playlists";

  // Fungsi untuk mencari playlist berdasarkan ID playlist Spotify
  const searchPlaylistByID = async (playlistID) => {
    if (token && playlistID) {
      try {
        const response = await fetch(`${spotifyAPI}/${playlistID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const playlist = await response.json();
          setSearchResults([playlist]);
        } else {
          console.error(
            "Gagal melakukan pencarian playlist:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Gagal melakukan pencarian playlist:", error);
      }
    }
  };

  // Mengambil token dari localStorage saat komponen di-mount
  useEffect(() => {
    const spotifyToken = localStorage.getItem("spotifyAccessToken");
    setToken(spotifyToken);
  }, []);

  // Gunakan useEffect untuk memanggil fungsi pencarian saat URL atau token berubah
  useEffect(() => {
    if (urlInput.includes("https://open.spotify.com/playlist/")) {
      const playlistID = urlInput.split("/playlist/")[1];
      searchPlaylistByID(playlistID);
    }
  }, [urlInput, token]);

  return (
    <div>
      <input
        type="text"
        placeholder="Masukkan URL playlist Spotify"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
      />
      <div>
        {searchResults.map((playlist) => (
          <div key={playlist.id} className="border p-4 mb-4">
            <p className="text-lg font-semibold mb-2">{playlist.name}</p>
            <p className="text-gray-600 mb-2">
              Pemilik Playlist: {playlist.owner.display_name}
            </p>
            <img
              src={playlist.images[0].url}
              alt="Playlist Cover"
              className="mb-4 w-[5vw] h-[5vw]"
            />
            <h2 className="text-lg font-semibold mb-2">Daftar Lagu:</h2>
            <ul>
              {playlist.tracks.items.map((track) => (
                <li
                  key={track.track.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={track.track.album.images[0].url}
                      alt="Lagu Cover"
                      className="w-12 h-12"
                    />
                    <div>
                      <p className="text-lg font-semibold mb-1">
                        {track.track.name}
                      </p>
                      <p className="text-gray-600">
                        by {track.track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">{formatDuration(track.track.duration_ms)}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyPlaylistSearch;

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
}
