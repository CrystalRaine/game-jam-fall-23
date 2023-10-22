import consolation from '../sound/Consolation.mp3';
import useSound from 'use-sound';



export default function Lose(){
    
    const [play, { stop }] = useSound(
        consolation,
        {volume: 1}
    );

    //playMusic()

    return (<div className="loseScreen">
        <h2 onMouseEnter={() => {stop(); play();}}>Lose</h2>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Strategy Guide</a>
    </div>)
}