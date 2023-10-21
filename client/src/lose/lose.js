import consolation from '../sound/Consolation.mp3';



export default function Lose(){
    function playMusic() {
        new Audio(consolation).play();
    }

    return (<div className="loseScreen">
        {playMusic()}
        <h2>Lose</h2>
    </div>)
}