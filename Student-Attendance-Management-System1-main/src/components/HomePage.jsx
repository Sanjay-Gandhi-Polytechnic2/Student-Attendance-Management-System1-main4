import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Cpu,
  HardHat,
  Settings,
  Zap,
  Laptop,
  Hammer,
} from "lucide-react";

// Assets
import logoImg from "../assets/logo.png";
import facultyGroupImg from "../assets/staff_group.png";
import courtyardImg from "../assets/campus_courtyard.jpg";
import frontImg from "../assets/campus_front.jpg";
import labImg from "../assets/computer_lab.jpg";
import classroomImg from "../assets/classroom_session.png";
import facultyMeetingImg from "../assets/faculty_meeting.png";

const Navbar = ({ onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Courses", href: "#courses" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: isScrolled
            ? "rgba(255,255,255,0.95)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          transition: "0.4s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={logoImg}
              alt="Logo"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
              }}
            />

            <h2
              style={{
                color: isScrolled ? "#1e3a8a" : "white",
                fontWeight: "800",
              }}
            >
              SGP BALLARI
            </h2>
          </div>

          {/* Desktop Nav */}
          <nav
            className="desktop-nav"
            style={{
              display: "flex",
              gap: "2rem",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  color: isScrolled ? "#111" : "white",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={onLogin}
              style={{
                background: isScrolled
                  ? "#7e22ce"
                  : "rgba(255,255,255,0.15)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "50px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: isScrolled ? "#111" : "white",
                display: "none",
              }}
              className="mobile-menu"
            >
              {isMobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div
            style={{
              background: "white",
              padding: "1rem 2rem",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  display: "block",
                  padding: "1rem 0",
                  color: "#111",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </header>

      <style>
        {`
        @media(max-width:768px){
          .desktop-nav{
            display:none !important;
          }

          .mobile-menu{
            display:block !important;
          }
        }
        `}
      </style>
    </>
  );
};

const CourseCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    style={{
      background: "white",
      padding: "2rem",
      borderRadius: "24px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    }}
  >
    <div
      style={{
        marginBottom: "1rem",
        color: "#7e22ce",
      }}
    >
      {icon}
    </div>

    <h3
      style={{
        fontSize: "1.4rem",
        fontWeight: "800",
        marginBottom: "1rem",
      }}
    >
      {title}
    </h3>

    <p
      style={{
        color: "#555",
        lineHeight: "1.7",
      }}
    >
      {desc}
    </p>
  </motion.div>
);

const HomePage = ({
  onLogin,
  onRegister,
  onDashboard,
  isAuthenticated,
}) => {
  return (
    <div>
      <Navbar onLogin={onLogin} />

      {/* HERO SECTION */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#ec4899 0%,#c026d3 50%,#7e22ce 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "120px 20px",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "350px",
            height: "350px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(140px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 10,
            maxWidth: "1100px",
          }}
        >
          {/* Logo Card */}
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              width: "fit-content",
              margin: "0 auto 2rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              flexWrap: "wrap",
            }}
          >
            <img
              src={logoImg}
              alt="Logo"
              style={{
                width: "100px",
                height: "100px",
              }}
            />

            <div style={{ textAlign: "left" }}>
              <h3
                style={{
                  color: "#555",
                  fontWeight: "600",
                }}
              >
                T.E.H.R.D Trust's
              </h3>

              <h1
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  color: "#222",
                }}
              >
                Sanjay Gandhi Polytechnic
              </h1>

              <p style={{ color: "#666" }}>
                Recognised by AICTE, New Delhi
              </p>

              <p style={{ color: "#666" }}>
                ISO 9001:2015 Certified
              </p>
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 28px",
              borderRadius: "20px",
              backdropFilter: "blur(20px)",
              color: "white",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />

            Institution Branding Badges
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(3rem,8vw,6rem)",
              fontWeight: "900",
              color: "white",
              lineHeight: "1",
            }}
          >
            Attendance
            <br />

            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontStyle: "italic",
              }}
            >
              Management System
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              maxWidth: "850px",
              margin: "2rem auto",
              lineHeight: "1.8",
            }}
          >
            The most advanced registry management system designed for
            speed, security, and scalability. Built with precision for
            Sanjay Gandhi Polytechnic.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {isAuthenticated ? (
              <button
                onClick={onDashboard}
                style={{
                  background: "white",
                  color: "#7e22ce",
                  border: "none",
                  padding: "18px 34px",
                  borderRadius: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={onRegister}
                  style={{
                    background: "white",
                    color: "#7e22ce",
                    border: "none",
                    padding: "18px 34px",
                    borderRadius: "18px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Get Started
                </button>

                <button
                  onClick={onLogin}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "18px 34px",
                    borderRadius: "18px",
                    fontWeight: "700",
                    backdropFilter: "blur(20px)",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* CAMPUS SECTION */}
      <section
        style={{
          padding: "80px 20px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "3rem",
            }}
          >
            Campus Highlights
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(300px,1fr))",
              gap: "2rem",
            }}
          >
            {[facultyGroupImg, courtyardImg, frontImg].map(
              (img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={img}
                    alt="Campus"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section
        id="courses"
        style={{
          padding: "80px 20px",
          background: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "4rem",
            }}
          >
            Our Courses
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(300px,1fr))",
              gap: "2rem",
            }}
          >
            <CourseCard
              icon={<Cpu size={50} />}
              title="Electronics"
              desc="Advanced communication and circuitry systems."
            />

            <CourseCard
              icon={<HardHat size={50} />}
              title="Civil Engineering"
              desc="Infrastructure and structural engineering."
            />

            <CourseCard
              icon={<Settings size={50} />}
              title="Mechanical"
              desc="Machines and manufacturing systems."
            />

            <CourseCard
              icon={<Zap size={50} />}
              title="Electrical"
              desc="Power systems and electrical innovations."
            />

            <CourseCard
              icon={<Laptop size={50} />}
              title="Computer Science"
              desc="Software development and AI technologies."
            />

            <CourseCard
              icon={<Hammer size={50} />}
              title="Metallurgy"
              desc="Material science and metal processing."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        style={{
          background: "#0f172a",
          color: "white",
          padding: "80px 20px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: "3rem",
          }}
        >
          <div>
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.5rem",
              }}
            >
              Contact Us
            </h3>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <MapPin />
              Ballari, Karnataka
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Phone />
              08392 266331
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <Mail />
              sgpbellary@gmail.com
            </div>
          </div>

          <div>
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.5rem",
              }}
            >
              Quick Links
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <a
                href="#about"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <ChevronRight size={18} />
                About
              </a>

              <a
                href="#courses"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <ChevronRight size={18} />
                Courses
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            opacity: 0.7,
          }}
        >
          © 2024 Sanjay Gandhi Polytechnic. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
{/* Logo Card */}
<div
  style={{
    background: "white",
    borderRadius: "28px",
    padding: "1.8rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.2rem",
    width: "fit-content",
    margin: "0 auto 1.5rem",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    maxWidth: "850px",
    flexWrap: "nowrap",
  }}
>
  {/* Logo */}
  <img
    src={logoImg}
    alt="SGP Logo"
    style={{
      width: "90px",
      height: "90px",
      objectFit: "contain",
      flexShrink: 0,
    }}
  />

  {/* Text */}
  <div
    style={{
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <h3
      style={{
        color: "#444",
        fontSize: "1rem",
        fontWeight: "600",
        margin: 0,
        marginBottom: "0.4rem",
      }}
    >
      T.E.H.R.D Trust's
    </h3>

    <h1
      style={{
        color: "#111",
        fontSize: "2.6rem",
        fontWeight: "800",
        lineHeight: "1.1",
        margin: 0,
      }}
    >
      Sanjay Gandhi Polytechnic
    </h1>

    <p
      style={{
        color: "#555",
        fontSize: "0.9rem",
        marginTop: "0.7rem",
        marginBottom: "0.2rem",
      }}
    >
      Recognised by AICTE, New Delhi & Govt. of Karnataka
    </p>

    <p
      style={{
        color: "#555",
        fontSize: "0.9rem",
        margin: 0,
      }}
    >
      ISO 9001:2015 Certified
    </p>
  </div>
</div>
export default HomePage;