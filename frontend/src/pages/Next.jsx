import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../index.css";
import axiosInstance from "../api/axios.config";
import MusicPlayer from "../components/MusicPlayer";
import "../MusicPlayer.css";
// import { Link } from 'react-router-dom';
// Who we are, change-makers
export default function Next() {
  const [songList, setSongList] = useState([]);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = "https://terranovare.tech/api/";

  useEffect(() => {
    if (location.state?.scrollToBottom) {
      setTimeout(() => {
        const bottomElement = document.getElementById("bottom");
        if (bottomElement) {
          bottomElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [location]);

  useEffect(() => {
    // Fetch song list from backend
    const fetchSongs = async () => {
      try {
        const response = await axiosInstance.get("/music/music-list");
        setSongList(
          response.data.files.map((file) => ({
            name: file,
            url: `${BASE_URL}${file}`,
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching songs:", error);
      }
    };

    // Fetch user info from session storage (assuming token contains user data)
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        setUser(userData);
      } catch (error) {
        console.error("❌ Error decoding user token:", error);
      }
    }

    fetchSongs();
  }, []);

  useEffect(() => {
    if (location.state?.scrollToBottom) {
      const bottomElement = document.getElementById("bottom");
      if (bottomElement) {
        bottomElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div>
      <section
        id="main-content"
        className="row bg-dark text-white text-center py-5 titleHeader"
      >
        <h1 aria-hidden="false" className="fw-light m-0">
          <em>
            Believe <strong>AND YOU CAN</strong>
            <strong>
              <br />
              IMAGINE
            </strong>
          </em>
        </h1>
        <p aria-hidden="false" className="text-light m-0">A Vision for Sustainable Growth</p>
      </section>

      <div className="container pt-5 mt-2">
        {/* First Featurette */}
        <div id="next" className="row featurette align-items-center">
          <h1>
            <span className="fw-bold fs-5">What's</span> <em>Next?</em>
          </h1>
          <div className="col-md-8">
            <h2 aria-hidden="false" className="featurette-heading">
              Terra'Novare stands as the guiding force behind E-Finity <span className="text-muted"> 
                 ensuring its mission stays true while forging financial pathways
                and enterprise connections.
              </span>
            </h2>
            <p aria-hidden="false" className="lead">
              As an entity dedicated to sustainability and progress,
              Terra'Novare oversees E-Finity's direction, providing the
              resources and strategic insight needed to make lasting change. We
              believe in building a future where businesses, communities, and
              individuals collaborate to shape a thriving, interconnected world.
            </p>
          </div>
          <div className="col-md-4">
            <img
              className="img-fluid w-100 rounded mb-2"
              src="images/Golden Compass.png"
              alt="Gold Compass"
            />
          </div>
        </div>

        <hr className="featurette-divider" />

        {/* Second Featurette */}
        <div className="row featurette align-items-center">
          <div className="col-md-8 order-md-2">
            <h2 aria-hidden="false" className="featurette-heading">
              More Than a Seat—A Role in
              <span className="text-muted"> the Revolution.</span>
            </h2>
            <p aria-hidden="false" className="lead">
              For those looking to support this movement, we invite businesses
              and entities to become long-term partners through our sponsorship
              program. More than just donors, our sponsors become invested
              stakeholders, with a voice in the initiatives they help bring to
              life. Our membership model ensures that those who align with our
              vision have the opportunity to participate in shaping the
              direction of our efforts, creating an ecosystem where investment
              flows both ways.
            </p>
          </div>
          <div className="col-md-4 order-md-1">
            <img
              className="img-fluid w-100 rounded mb-2"
              src="images/Gold.png"
              alt="Gold Medal"
            />
          </div>
        </div>

        <hr className="featurette-divider" />

        {/* Third Featurette */}
        <div className="row featurette align-items-center">
          <div className="col-md-7">
            <h2 aria-hidden="false" className="featurette-heading">
              Have Hope
              <span className="text-muted"> This is just the beginning.</span>
            </h2>
            <p aria-hidden="false" className="lead">
              As we grow, we will unveil deeper levels of involvement, exclusive
              opportunities, and structured membership tiers tailored for those
              who want to take an active role in this journey. Early supporters
              will not just witness change—they will help define it. The future
              belongs to those who build it with us. Will you be one of them?
            </p>
          </div>
          <div className="col-md-5">
            <img
              className="img-fluid w-100 rounded mb-2"
              src="images/Golden Door.png"
              alt="Gold Door"
            />
          </div>
        </div>
        <div className="m-3" id="bottom">
          {songList.length > 0 ? (
            <>
              <h2 aria-hidden="false" className="my-4">How I'm Fundraising</h2>
              <MusicPlayer tracks={songList} isAdmin={user?.roles?.includes("admin")} />
              <div className="mt-4">
                <button className="btn btn-success" onClick={() => navigate("/#bottom")}>
                  Book Now
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="alert alert-warning my-1">
                Whoops! That was almost cool. <br />
                No songs available now! The show MUST go on! <br />
                Come back soon...
              </div>
              <div className="my-2">
                <p aria-hidden="false" className="my-1"> For now... </p>
                <Link aria-hidden="false" className="btn btn-primary" to="/shop">
                  Preview the Shop
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
