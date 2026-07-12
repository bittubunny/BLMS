import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            navigate("/login");
            return;
        }

        setUser(storedUser);

        const savedProfile = JSON.parse(
            localStorage.getItem(`profile-${storedUser.email}`)
        ) || {};

        setProfile(savedProfile);

    }, [navigate]);

    if (!user || !profile) return null;

    return (
        <div className="profile-page">

            <div className="profile-card">

                <div className="profile-header">

                    <div className="profile-avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h1>{user.name}</h1>

                        <p>{user.email}</p>

                    </div>

                </div>

                <div className="profile-section">

                    <h2>About Me</h2>

                    <p>
                        {profile.bio || "No bio added yet."}
                    </p>

                </div>

                <div className="profile-info-grid">

                    <div className="info-box">

                        <h3>Gender</h3>

                        <p>{profile.gender || "-"}</p>

                    </div>

                    <div className="info-box">

                        <h3>Country</h3>

                        <p>{profile.country || "-"}</p>

                    </div>

                    <div className="info-box">

                        <h3>State</h3>

                        <p>{profile.state || "-"}</p>

                    </div>

                </div>

                <div className="profile-section">

                    <h2>Social Links</h2>

                    {profile.socialLinks?.length ? (

                        profile.socialLinks.map((link, index) => (

                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="social-link"
                            >
                                {link}
                            </a>

                        ))

                    ) : (

                        <p>No social links added.</p>

                    )}

                </div>

                <button
                    className="edit-profile-btn"
                    onClick={() => navigate("/edit-profile")}
                >
                    Edit Profile
                </button>

            </div>

        </div>
    );
};

export default Profile;
