import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);

    const profile = JSON.parse(localStorage.getItem(`profile-${storedUser.email}`)) || {};
    setBio(profile.bio || "");
    setGender(profile.gender || "");
    setCountry(profile.country || "");
    setState(profile.state || "");
    setSocialLinks(profile.socialLinks?.length ? profile.socialLinks : [""]);
  }, [navigate]);

  const handleSocialChange = (index, value) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, ""]);
  const removeSocialLink = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated.length ? updated : [""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const profileData = {
      bio,
      gender,
      country,
      state,
      socialLinks: socialLinks.filter((link) => link.trim() !== ""),
    };

    localStorage.setItem(`profile-${user.email}`, JSON.stringify(profileData));
    alert("Profile updated successfully!");
  };

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </label>

        <label>
          Gender
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <div className="location-fields">
          <label>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </label>

          <label>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </label>
        </div>

        <label>
          Social Links
          {socialLinks.map((link, index) => (
            <div key={index} className="social-link-input">
              <input
                type="url"
                value={link}
                placeholder="https://..."
                onChange={(e) => handleSocialChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeSocialLink(index)}>
                ❌
              </button>
            </div>
          ))}
          <button type="button" className="add-link-btn" onClick={addSocialLink}>
            + Add Link
          </button>
        </label>

        <button type="submit" className="save-btn">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
