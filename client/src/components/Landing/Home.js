import '../../static/css/App.css';
import Landing from './Landing';
import About from "./About"
import Community from './Community';
import Guide from './Guide';
import Footer from './Footer';

function Home() {
  return (
    <div>
      <Landing />
      <About />
      <Community />
      <Guide />
      <Footer />
    </div>
  );
}

export default Home;
