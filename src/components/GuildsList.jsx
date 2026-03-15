//import { guilds } from "../data";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, Bolt } from "lucide-react";

const SIGNIN_URL = `/api/auth/signin`;

export default function GuildList() {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/dashboard/@me/guilds", {
          credentials: "include",
        });
        if (!res.ok) {
          switch (res.status) {
            case 401:
              console.log("Not authenticated, redirecting to signin page...");
              window.location.href = SIGNIN_URL;
              throw new Error("Not authenticated");

            default:
              throw new Error("An error occured");
          }
        }
        const text = await res.text();
        let guilds;
        try {
          guilds = JSON.parse(text);
        } catch (err) {
          console.error("Failed to parse JSON from /@me/guilds", err, { text });
          throw new Error("Invalid server response");
        }
        console.log("guilds received:", guilds);
        setGuilds(guilds);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 w-fit mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="size-12 animate-spin" />
        </div>
      ) : (
        <>
          {!guilds.length ? (
            <p>No servers found</p>
          ) : (
            <>
              {guilds.map((guild) => (
                <Link
                  to={`/guilds/${guild.id}`}
                  key={guild.id}
                  className="flex flex-col p-4 border border-gray-200/25 hover:border-gray-200/50 transition-colors rounded-md mb-2 justify-center items-center relative overflow-hidden w-full max-w-80 sm:w-52 hover:drop-shadow-2xl shadow-black"
                >
                  {guild.icon ? (
                    <>
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256`}
                        alt={guild.name}
                        className="absolute inset-0 w-full h-1/2 blur-sm -z-20 object-cover brightness-[20%]"
                        aria-hidden
                      />
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
                        alt={guild.name}
                        className="size-14 rounded-full mb-2"
                        aria-hidden
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-primary w-full h-1/2 blur-sm -z-20 object-cover brightness-[20%]" />
                      <div className="size-14 rounded-full mb-2 bg-secondary flex items-center justify-center">
                        <Bolt className="size-10" />
                      </div>
                    </>
                  )}
                  <h3 className="font-semibold text-center line-clamp-1">
                    {guild.name}
                  </h3>
                </Link>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
