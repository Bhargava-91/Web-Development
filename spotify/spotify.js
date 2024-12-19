let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutes(seconds){
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/Web-Development/spotify/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li data-song="${song.replaceAll("%20", " ")}"> <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                                <div>Bhargava</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())


            // const songName = e.getAttribute("data-song"); // Get the song from data attribute
            // playMusic(songName);    // Play the corresponding song
        });
    });
    return songs
}

const playMusic= (track, pause = false)=>{
    // let audio = new Audio("/spotify/songs/" + track)
    currentsong.src = `/Web-Development/spotify/${currFolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
}

async function main() {

    await getSongs("songs/ncs")
    playMusic(songs[0], true)


    play.addEventListener("click", () =>{
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "play.svg"

        }
    })

    // time update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
    })

    // seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // hamburger 
    document.querySelector(".hamburger").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "0"
    })

    // hamburger close 
    document.querySelector(".close").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "-120%"
    })

    // previous
    previous.addEventListener("click", () =>{
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
        
    })
    
    // next
    next.addEventListener("click", ()=> {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if (index + 1 < songs.length) {
            playMusic(songs[index+1])
        }
    })

    //range volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        const volumeImage = document.querySelector(".volume > img");
        if (document.querySelector(".range").getElementsByTagName("input")[0].value == 0) {
            volumeImage.src = volumeImage.src.replace("volume.svg", "mute.svg");
        }else{
            volumeImage.src = volumeImage.src.replace("mute.svg", "volume.svg");
        }
        currentsong.volume = parseInt(e.target.value)/100
    })

    // playlists
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click",async item =>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    });

    // mute
    document.querySelector(".volume>img").addEventListener("click", (e)=>{
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}

main()



