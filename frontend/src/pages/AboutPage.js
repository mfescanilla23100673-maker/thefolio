import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeTheme, toggleTheme, getThemeIcon } from '../utils/themeUtils';
import ibaImg from '../assets/iba.jpg';
import buwanImg from '../assets/buwan.jpg';

function AboutPage() {
  const [themeIcon, setThemeIcon] = React.useState('🌙');

  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme();
    setThemeIcon(getThemeIcon());
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    setThemeIcon(getThemeIcon());
  };

  return (
    <div className="about-page">
      {/* HEADER / NAVIGATION */}
      <header className="header">
        <h1 className="logo">MFAE POETRY</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about" className="active">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/register">Registration</Link></li>
          </ul>
        </nav>
      </header>

      <main className="container">
        <button 
          id="theme-toggle" 
          className="theme-toggle"
          onClick={handleThemeToggle}
        >
          {themeIcon}
        </button>

        <section className="section">
          <h2>My Journey with Poetry</h2>
          <p>Writing has always been my way of expressing the unspoken. Here is how my involvement with literature has evolved:</p>
          
          <ol className="timeline">
            <li><strong>2020:</strong> Started writing short verses in my personal journal.</li>
            <li><strong>2022:</strong> Explored Tagalog "Tula" to connect with my roots.</li>
            <li><strong>2023:</strong> Began to write "Tula" for my love one.</li>
            <li><strong>2026:</strong> Launched this web portfolio to share my collection.</li>
          </ol>

          <blockquote style={{ textAlign: 'center' }}>
            "Naapuhap ang Binibining marilag,<br />
            Sa pisikal at kinaiya, parang duyog,<br />
            At nang marahuyo sayong titig,<br />
            Tangan-tangan mo aking pag-ibig,<br />
            Galimgim ng puso ika'y aking liyag."
            <cite>— MFAE POETRY</cite>
          </blockquote>
        </section>

        <section className="section">
          <h2>Selected Works</h2>
          
          <div className="poem-card">
            <img src={ibaImg} alt="Visual representation of my first poem" className="poem-img" />
            <div className="poem-content">
              <h3>Iba ka sa lahat</h3>
              <p>
                Naiiba ka hindi dahil sa pangit ka, naiiba ka kundi dahil walang kapareha ang iyong ganda, naiiba ka at kapansin-pasin sa mga mata nila, naiiba ka kaya't nilalait ka nila pero hindi ibig sabihin nun ay kalait-lait ka kundi ang ibig sabihin nun ay inggit sila sa kung anong meron ka na wala sila, inggit sila sa kung gano ka kaganda na hindi makukumpara sakanila, inggit sila sa kakaiba mong ganda at inggit sila dahil wala kang kapareha
                <br /><br />
                Walang ano mang salita ang makakapag bago sa aking nakikita, nakikitang taglay mong ganda at kahit na hindi ka maniwala dahil sa mga sabi-sabi ng iba hindi mo maiiba ang katagang IKA'Y MAGANDA dahil ito ang aming nakikita sa iyong mga mata, hindi ko hiling na ika'y maniwala ang makinig sa mga binibitawang kataga ay sapat na
                <br /><br />
                Maaari bang bigyan ako ng pagkakataon upang maihayag ang kagandahan mong tinatangi, kagandahang hindi matutumbasan ng ano mang salapi hangad ko'y maniwala ka sa iyong sarili nang sa gayon ay maunawan mo kung ano man ang aming ipinapa intindi
              </p>
            </div>
          </div>

          <div className="poem-card">
            <img src={buwanImg} alt="Visual representation of my second poem" className="poem-img" />
            <div className="poem-content">
              <h3>Buwan</h3>
              <p>
                maihahalintulad sa buwan ang iyong ganda<br />
                marahil ang gustong makita ka'y tumitingala<br />
                ganda mo'y kakaiba at hindi nakakasawa<br />
                araw-araw nananabik na makita ng mata.<br /><br />
                
                o sinta, ang isang dalagang walang kapareha<br />
                pinag pala ang isang tulad mo ng mga tala<br />
                sa pag lipas ng panahon ganda mo'y dala-dala<br />
                pumapayapa ang isip kapag nakikita ka.<br /><br />
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>Contact: mfescanilla23100673@student.dmmmsu.edu.ph | Phone: 09120863514</p>
        <p>© 2026 Mark Fermin A. Escanilla. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;
