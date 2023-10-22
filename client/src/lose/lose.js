import consolation from '../sound/Consolation.mp3';
import useSound from 'use-sound';
import { useNavigate } from "react-router-dom";
import "./lose.css";


export default function Lose(){
    const navigate = useNavigate();

    const [play, { stop }] = useSound(
        consolation,
        {volume: 1}
    );

    function goToMenu() {
        navigate("http://localhost:3000/");
    }

    //playMusic()

    return (<div className="loseScreen">
        <h2 onMouseEnter={() => {stop(); play();}}>Lose</h2>
        <button onClick={goToMenu} className='menuButton'>Main Menu</button>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Strategy Guide</a>
    </div>)
}