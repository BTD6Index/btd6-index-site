import PageTitle from "../util/PageTitle";

function HomePage() {
    return <>
        <PageTitle>High-Level Bloons TD 6 Challenges</PageTitle>
        <p>We are a community of Bloons TD 6 players tracking various community-created challenges.</p>
        <p>Support us using the in-game creator code <strong>BTD6INDEX</strong></p>
        <h2>Popular Challenges</h2>
        <p><a href='/2mp'>2 Million Pops CHIMPS</a> - Complete a BTD6 CHIMPS game with 2 million pops on a tower (excluding regrow pops)</p>
        <p><a href='/2tc'>2 Towers CHIMPS</a> - Complete a BTD6 CHIMPS game with 2 towers</p>
        <h2>Latest Video</h2>
        <iframe id="latestvid" src="https://www.youtube-nocookie.com/embed?listType=playlist&list=UULFFbnVzrtC3yShaAqwbAsyPw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        <h2>Join Us</h2>
        <p><a href="https://www.youtube.com/@btd6index">Youtube</a> | <a href="https://discord.gg/RAGfmAB">Discord</a> | <a href="https://github.com/BTD6Index">GitHub</a></p>
    </>;
}

export default HomePage;
