import consolation from '../sound/Consolation.mp3';



export default function Lose(){
    function playMusic() {
        new Audio(consolation).play();
    }
    //playMusic()

    return (<div className="loseScreen">
        <h2>Lose</h2>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Strategy Guide</a>
    </div>)
}