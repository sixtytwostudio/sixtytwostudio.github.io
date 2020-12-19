

AFRAME.registerComponent('loading-xmas', {
  init: function (){
    var loadingContainer = document.getElementsByClassName("xload")
    // var loadingContainer = document.getElementsByClassName("arjs-loader")
    // var loadingImages = document.getElementById("load-Image")
    var postloadContainer = document.getElementById("postload")
    // var laptopVideo = document.getElementById('scene3_gif')
    // var phoneVideo = document.getElementById('scene6_gif')
    // console.log("loading screen initialized")
    var hasLoaded = false;
    var progressBar = document.getElementById("xload__bar_progress")
    var audioArray = document.getElementsByClassName("audio")
    progressBar.style.width = '100%'
    // console.log(progressBar.style.width)
    
    //document.getElementById('gift_1').addEventListener('loaded', function() { console.log("Gift loaded") })
    setTimeout(
    function() {
      loadingContainer[0].remove();
      postload.style.display = 'block'
    }, 3000)

    // laptopVideo.pause();
    // phoneVideo.pause();
    for (const audio of audioArray) {
      audio.components.sound.pauseSound();
    }
    /*
    setTimeout(
      function() {
        subDisplay();
      }, 1);
    function subDisplay() {
        //loadingContainer[0].style.display='none'
        loadingContainer[0].remove();

        hasLoaded = true;
    };*/
  }
})

AFRAME.registerComponent('dynamic-cursor', {
  init: function(){
    console.log("Dynamic cursor loaded")

    var camera = document.getElementById('fuseCursor')
    var dynamicScanCursor;
    var cursorLoad;
    const scanButton = document.getElementById('scanButton')
    const cancelButton = document.getElementById('cancelButton')
    const scanButtonText = document.getElementById('scanButtonText')
    // console.log("Does scan button have value: " + scanButton)
    var scanning = false

    scanButton.addEventListener('click', startScan)
    cancelButton.addEventListener('click', cancelScan)

    function startScan() {
      {


        // console.log('scan button clicked')
        var dynamicScanCursor = document.createElement('a-entity');
        dynamicScanCursor.setAttribute('id', 'dynamic scan cursor')
        dynamicScanCursor.setAttribute('position','0 0 -1')
        dynamicScanCursor.setAttribute('scale','.2 .2 .2')
        dynamicScanCursor.setAttribute('geometry', 'primitive: plane')
        dynamicScanCursor.setAttribute('material', 'src: #scanbox; opacity: 0.5; shader: flat')
        dynamicScanCursor.setAttribute('cursor', 'rayOrigin: mouse; fuse: true; fuseTimeout: 3000')
        dynamicScanCursor.setAttribute('raycaster', 'objects: a-box')
        dynamicScanCursor.setAttribute('visible', true)
        dynamicScanCursor.setAttribute('animation', 'property: position; from: 0 -.1 -.8; to: 0 0 -1; easing: easeOutSine; dur: 1000; autoplay: true')
        dynamicScanCursor.setAttribute('animation__scan', 'startEvents: fusing; property: scale; from: .2 .2 .2; to: 0.1 0.1 0.1; easing: easeOutSine; dur: 4000') 
        dynamicScanCursor.setAttribute('animation__out', "startEvents: mouseleave; property: scale; to: .2 .2 .2; dur: 100;")
        camera.appendChild(dynamicScanCursor)
        var cursorLoad = document.createElement('a-entity')
        cursorLoad.setAttribute('id', 'cursor load')
        cursorLoad.setAttribute('scale', '.5 .5 .5')
        cursorLoad.setAttribute('geometry', 'primitive: plane')
        cursorLoad.setAttribute('visible', 'false')
        cursorLoad.setAttribute('material', 'shader:gif;src:url(/graphics/simple_loading.gif);transparent:true')
        dynamicScanCursor.appendChild(cursorLoad)
                cancelButton.style.display = 'block'
        scanButton.style.display = 'none'
        scanInstructionText.innerHTML = 'Scan a <b>Gift Box</b> to activate a scene.'
        // scanButtonText.innerHTML = "Cancel"
        // scanButton.style.background = "#ffffff"
        // scanButton.style.border = "0.2em solid #ffffff";
        scanning = true
      
        dynamicScanCursor.addEventListener('fusing', (e) => {
          cursorLoad.setAttribute('visible', 'true')
        })
        dynamicScanCursor.addEventListener('mouseleave', (e) => {cursorLoad.setAttribute('visible', 'false')})
      
    }
    }

    function cancelScan() {
        // console.log("canceling scan")
        cancelButton.style.display = 'none'
        scanButton.style.display = 'block'
        scanning = false
        camera.removeChild(document.getElementById('dynamic scan cursor'))
    }
  }
})

AFRAME.registerComponent('start-animation', {
  schema: {
    name: {type: 'string'},
    audio_src: {type: 'string'},
    length: {type: 'int'},
    video: {default: false},
    selfie: {default: 'false'}
  },
  init: function () {
    var el = this.el;
    var model = document.getElementById(this.data.name)
    // var scene1model = document.getElementById('scene1_santa_model')
    var cursor = document.getElementById('fuseCursor')
    var isNotActive = true
    var isPlaying = false
    var scene = document.getElementsByTagName("a-scene")
    const closeButton = document.getElementById('endSceneButton')
    const scanButton = document.getElementById('scanButton')
    const scanButtonText = document.getElementById('scanButtonText')
    var giftArray = document.getElementsByClassName("gift")
    var sceneArray = document.getElementsByClassName("scene")
    var audioArray = document.getElementsByClassName("audio")
    var audio_source = this.data.audio_src
    var sceneAudio// = document.getElementById(this.data.audio_src)
    const song = document.getElementById('song')
    var videoClipName = this.data.video



    // console.log("VideoClip name: " + videoClipName)
    const shutterButton = document.getElementById('shutterButton')
    const tapInstructions = document.getElementById('tapInstructions')
    const scanInstructions = document.getElementById('scanInstructions')
    const sInstructions = document.getElementById('selfieInstructions')
    const pointer = document.getElementById('pointer')
    const photoFrame = document.getElementById('selfieContainer')
    // const xblink_widget = document.getElementById('cameraflash')
    // var scan = true
    var animationLength = this.data.length
    var isSelfie = this.data.selfie
    var experienceHasStarted = false
    var currentScene = model.getAttribute('id')
    var animations = document.getElementsByClassName(currentScene + "_model")
    var marker = document.getElementById('marker_' + currentScene)
    var warning = document.getElementById('markerLostInstructions')
    var markers = document.getElementsByClassName('marker')
    var scanning = false
    var dynamicScanCursor;


      // scanButton.addEventListener('click', startScan)



      // if(scan){
      //   tapInstructions.style.display = 'none'
      // }
      // else { 
        scanInstructions.style.display = 'block'
      // }
      selfieInstructions.style.display = 'none'
      el.addEventListener('fusing', (e) => {console.log("fusing")})

      el.addEventListener('click', (e) => {
        if(!experienceHasStarted) {
          song.setAttribute("src", "/audio/song.mp3");
          song.components.sound.playSound()
          experienceHasStarted = true;
        }
        if(sceneAudio!=null) {
          for (const audio of audioArray) {
            audio.components.sound.pauseSound();
          }    
        }
        if(isNotActive) {
          this.el.setAttribute('visible', true)
          sceneStart()
          
          if(this.data.length) {
            // console.log("timer started")
            if(isSelfie == "false"){
              setTimeout(
                function() {
                  isSceneActiveCheck()
                  
                  //sceneEnd();
                  // for (child in el.children)
                  //   {
                  //     child.emit(this.data.name +"_end")
                  //   }
                }, this.data.length);
            }
        }
        else {
          sceneEnd();
          // console.log(this.data.name + " is not active")
          }
        }
      });

    el.addEventListener('click', function () {
      tryStartAnimation()

      // console.log("model clicked, time to play video / gif")
      if(videoClipName)
      {
        // console.log(currentScene+"_gif")
        var video = document.getElementById(currentScene + "_gif")
        video.setAttribute("material", "autoplay: true")
        // console.log("is video playing?: " + video.isPlaying)
      }
      // if(currentScene =="scene3" || currentScene =="scene6") {
      //   if(currentScene=="scene3") 
      //     {
      //       video = document.getElementById("laptop_video");
      //       video.setAttribute("src", "/videos/scene3_noaudio.mp4");
      //       video.play();
      //       //video.muted = true;
      //     }
      //     else if(currentScene=="scene6")
      //     {
      //       video = document.getElementById("phone_video");
      //       video.setAttribute("src", "/videos/scene6_noaudio.mp4");
      //       video.play();
      //       //video.muted = true;
      //     }        
          
      //     // video.addEventListener("loaded", function() {
      //     //     console.log("video has loaded")

              
      //     //   })
      //     // video.load();
      //   }    
      })


    closeButton.addEventListener('click', () => {
      if (isNotActive == false) {
        sceneEnd();
      }
      //else {closeButton.removeEventListener('click')}
    })

    function startSelfie(){
      // xblink_widget.classList.add('xblink--active')
      photoFrame.style.display = "block"
      // console.log("setting selfie mode to true")

      marker.removeEventListener("markerFound",
          markerFoundWarning
      )
      marker.removeEventListener("markerLost",
          markerLostWarning
      )
      document.querySelector("a-scene").setAttribute('selfieMode', "true")
      // console.log(document.querySelector("a-scene").getAttribute('selfieMode'))
      shutterButton.hidden = false

      selfieInstructions.style.display = 'none'
      closeButton.style.display = 'none'
      document.getElementById('audioIconContainer').style.display = 'none'
      for (const scene of sceneArray) {
        scene.setAttribute('visible', false)
      }
      discardButton.addEventListener('click', sceneEnd, {once: true})
      discardButton.addEventListener('click', (e) => {
        song.components.sound.playSound()
      }, {once: true})
      // discardButton.addEventListener('click', () => {
      //   discardButton.removeEventListener('click',sceneEnd)
      // })
    }
    
    function isSceneActiveCheck() {
      if (isNotActive == false) {
        sceneEnd()
        console.log("scene timed out")
      }
      else { console.log("scene was already finished")}
    }

      function tryStartAnimation(){
        // console.log("start_" + currentScene)
        // console.log("Trying to start animation")
        if (!isPlaying /*&& isNotActive*/) {startAnimation()}
      }

    function startAnimation() {
        // console.log("starting animation")
        isPlaying = true
      // document.getElementById("test").emit("startScene1")
        
        for (var anim of animations){
          // console.log("starting animation for #" + anim)
          anim.setAttribute("animation-mixer", "clip: *; duration: " + animationLength/1000)
          anim.emit("start_" + currentScene)
        }
        
        // if (currentScene=="scene3") {

        //   document.getElementById('laptop_gif').play()
        // }

        if (audio_source!=null)
         {
          //var scene_audio = document.createElement("a-sound")
          // if(!experienceHasStarted) {

          // }
           // console.log("Current id for auidio is: " + currentScene + "_audio")
            sceneAudio = document.getElementById(currentScene + "_audio")
                      console.log(audio_source)
            sceneAudio.setAttribute('src', audio_source)

            //sceneAudio.setAttribute('volume', .5)
            sceneAudio.components.sound.currentTime = 0;
            sceneAudio.components.sound.playSound()
            // console.log("Scene audio is playing: " + sceneAudio.isPlaying)
          
        }

        setTimeout( function() {

          // document.getElementById("test").emit("startScene1")
            for (var anim of animations){
              anim.setAttribute("animation-mixer", "clip: '';")
              anim.emit("restart_" + currentScene)
              // console.log("emitting restart: " + "restart_" + currentScene)

            }
        // if (isActive) {
          // console.log("looping animation!")
          isPlaying = false
          //startAnimation()
        }
        //   else{ 
        //     console.log("ending loop!")
        //     isPlaying = false }

        // }
        , animationLength)
      }

    function flash(){
      // console.log("flashing!")
      $('.flash')
       .show()  //show the hidden div
       .animate({opacity: 1}, 500) 
       .fadeOut(300)
       .css({'opacity': 1})
       setTimeout(
          function() {
            startSelfie()
          }, 500)
    }
    function playAudio(){

    }

    function sceneStart(){
                      cancelButton.style.display = 'none'
        //scanButton.style.display = 'none'
      //document.querySelector('a-scene').components.screenshot.capture('perspective')
      cursor.removeChild(document.getElementById('dynamic scan cursor'))
      for (const scene of sceneArray) {
        scene.setAttribute('visible', false)
      }
      for (const gift of giftArray) {
        gift.setAttribute('visible', false)
      }
      el.setAttribute('visible',false)

        // if(scan)
        // {
          scanInstructions.style.display = 'none' 
          // pointer.setAttribute('material','visible: false') 
        // }
        // else{
        //   tapInstructions.style.display = 'none'          
        // }
        model.setAttribute('visible', true)

       isNotActive=false;
       // console.log("selfie status is = " + isSelfie)
       if(isSelfie == "true") {
          selfieInstructions.style.display = 'block'
          song.components.sound.pauseSound()
          setTimeout(
                function() {
                  flash()
                  //startSelfie();ah, rain

                }, animationLength);
       } else {
        shutterButton.hidden = false
        // shutterButton.addEventListener('click',)

        closeButton.style.display = 'block'}
        // var videoClip = document.getElementById(videoClipName)
        // if(videoClip!=null){
        //   videoClip.currentTime = 0;
        //   videoClip.play()   
        // }
      marker.addEventListener("markerFound",
          markerFoundWarning
      )
      marker.addEventListener("markerLost",
          markerLostWarning
      )
    }
    // function hideSceneEnd() {
    //   closeButton.style.display = 'none'
    // }
    function sceneEnd() {
        // console.log("scene ending")
        shutterButton.hidden = true
        closeButton.style.display = 'none'
        //cancelButton.style.display = 'none'
        scanButton.style.display = 'block'
        // if(scan)
        // {
          scanInstructions.style.display = 'block'
                    // pointer.setAttribute('material','visible: true')   
        // }
        // else{
        //   tapInstructions.style.display = 'block'          
        // }
        if(sceneAudio!=null){
          sceneAudio.components.sound.pauseSound()

        }
        for (const scene of sceneArray) {
          scene.setAttribute('visible', false)
        }
        for (const gift of giftArray) {
          gift.setAttribute('visible', true)
        }
        isNotActive=true

       if(isSelfie) {
          photoFrame.style.display = "none" 

       }
       document.querySelector("a-scene").setAttribute('selfieMode', "false")

        // pointer.setAttribute('cursor', 'rayOrigin: mouse; fuse: false; fuseTimeout: 4000')
        // pointer.setAttribute('visible', false)
        scanButton.style.display = 'block'

      if(videoClipName)
      {
        var video = document.getElementById(currentScene + "_gif")
        video.removeAttribute("material")
        if(currentScene=="scene3")
          {video.setAttribute("material", "shader:gif;src:url(/videos/scene3.gif);autoplay: false")}
        if(currentScene=="scene6") {
          video.setAttribute("material", "shader:gif;src:url(/videos/scene6.gif);autoplay: false")
        }
        // console.log("is video playing?: " + video.isPlaying)
      }

      marker.removeEventListener("markerFound",
          markerFoundWarning
      )
      marker.removeEventListener("markerLost",
          markerLostWarning
      )
      warning.style.display = 'none'
      // console.log("Removing marker event listeners")

    }

    marker.addEventListener("markerFound", markerFoundPlacement)
    marker.addEventListener("markerLost", markerLostPlacement)

    function markerFoundWarning() {
        console.log("marker1 found")
        warning.style.display = "none"     
    }
    function markerLostWarning() {
        console.log("marker1 lost")
        warning.style.display = "block"
    }

    function markerFoundPlacement() {
        console.log("marker1 found")
        el.setAttribute('position', {x: 0, y: 1, z: 0})
    }
    function markerLostPlacement() {
        console.log("marker1 found")
        el.setAttribute('position', {x: 100, y: 1, z: 0})     
    }

  }
});


AFRAME.registerComponent('toggle-audio', {
  schema: {
    name: {type: 'string'},
  },
  init: function () {

    const audioButton = document.getElementById('audioIconContainer')
//    const launchButton = document.getElementById('launchButton')
    const audio = document.getElementById('song')
    // const videos = document.getElementsByClassName('video_with_sound')
    const audioToggleIcon = document.getElementById('audioIcon')
    const scene = document.querySelector('a-scene')
    const song = document.getElementById("song")
    var markers = document.getElementsByClassName('marker')
    
    // console.log("toggleAudio is ready")

      // for (video of videos) {
      //   video.muted = "muted";
      // }
    audioButton.style.display = 'block'
    
    let isPlaying = false
    let hasAudioStarted = false
    const toggleAudio = () => {
      if (isPlaying === true) {
        audioToggleIcon.classList.remove('audioOn')
        audioToggleIcon.classList.add('audioOff')
        var sounds = document.getElementsByTagName('a-sound')
        for(i=0; i<sounds.length; i++) {
          sounds[i].setAttribute('volume', 0)
        }
        // for (video of videos) {
        //   video.muted = "muted";
        // }
        // console.log(sounds[i] + " volume set to 0")
        isPlaying = false
      }
      else {
        audioToggleIcon.classList.remove('audioOff')
        audioToggleIcon.classList.add('audioOn')
        var sounds = document.getElementsByTagName('a-sound')
        for(i=0; i<sounds.length; i++) {
          sounds[i].setAttribute('volume', 0.5)
        }
        // for (video of videos) {
        //   video.muted = "muted";
        // }
        if(!hasAudioStarted) {
            // var sounds = document.getElementsByTagName('a-sound')
            // for(i=0; i<sounds.length; i++) {
            //   sounds[i].components.sound.pauseSound();
            // }
            song.components.sound.playSound();
        }
        // console.log(sounds[i] + " volume set to 0.5")
        isPlaying = true
        hasAudioStarted=true
      }
    }

    for (var marker of markers) {
      marker.addEventListener('click', (e) => {
      if(!hasAudioStarted) {
        toggleAudio()
      }
    }
    )}

    
    audioButton.addEventListener("click", toggleAudio);
  }
});


AFRAME.registerComponent('photo-mode', {
  schema: {
    name: {type: 'string'},
    selfieMode: {default: false}
  },
  init: function() {
    var el = this.el
    const container = document.getElementById('photoModeContainer')
    const image = document.getElementById('photoModeImage')
    const shutterButton = document.getElementById('shutterButton')
    const closeButton = document.getElementById('closeButton')
    const shareButton = document.getElementById('shareButton')
    const canvas = document.querySelector('.a-canvas')
    const retakeButton = document.getElementById('retakeButton')
    const audioButton = document.getElementById('audioIconContainer')
    const shareBlurb = document.getElementById('shareBlurb')
    const shareBlurbAlt = document.getElementById('shareBlurbAlt')
    const keepContainer = document.getElementsByClassName('xdis')[0]
    const keepButton = document.getElementById('keepButton')
    const discardButton = document.getElementById('discardButton')
    const photoFrame = document.getElementById('selfieContainer')
    // let selfieMode = false
    var photoHasBeenTaken = false;
    //var selfieMode = this.data.selfieMode
    //const overlay = document.getElementById('photoOverlay')
    
    let shareFile
    let imageUrl

    $('.flash').hide()
    
    // Container starts hidden so it isn't visible when the page is still loading
    shutterButton.hidden = true
    closeButton.hidden = true
/*    canvas.addEventListener('click', () => {
      console.log("tapped")
    })*/
    container.style.display = 'block'


    discardButton.addEventListener('click', () => {
      container.classList.remove('photo')
      container.classList.remove('share')
      canvas.classList.remove('blur')
      photoFrame.style.display = 'none'
      audioButton.style.display = 'block'
      keepContainer.style.display = 'none'

      //overlay.setAttribute('visible', false)
      setTimeout(() => {
      // Tell the restart-camera script to stop watching for issues
        window.dispatchEvent(new Event('ensurecameraend'))
      }, 1000)
      photoHasBeenTaken = false
            closeButton.removeEventListener('click', promptKeep)
    })

    function promptKeep() {
        if (photoHasBeenTaken == true) {
        keepContainer.style.display='block'
      

        //overlay.setAttribute('visible', false)
        setTimeout(() => {
        // Tell the restart-camera script to stop watching for issues
          window.dispatchEvent(new Event('ensurecameraend'))
        }, 1000)
        photoHasBeenTaken = false
      }
    }

    

    keepButton.addEventListener('click', () => {
      // console.log("Keep button clicked")
      keepContainer.style.display = 'none'
      photoHasBeenTaken = true
    })

    //return a promise that resolves with a File instance
    function urlToFile(url, filename, mimeType){
      mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
      return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename, {type:mimeType});})
      );
    }
    retakeButton.addEventListener('click', () => {
      container.classList.remove('photo')
      if(el.getAttribute('selfieMode') == "true")
        {
          photoFrame.style.display = "block"
          // discardButton.addEventListener('click', () => {
          //   document.getElementById("scanButton").style.display = "block"
          //   shutterButton.hidden = true
          // })
        }
      closeButton.removeEventListener('click', promptKeep)
      container.classList.remove('share')
      canvas.classList.remove('blur')
      audioButton.style.display = 'block'

      //overlay.setAttribute('visible', false)
      setTimeout(() => {
      // Tell the restart-camera script to stop watching for issues
        window.dispatchEvent(new Event('ensurecameraend'))
      }, 1000)
    })
//    shareButton.addEventListener('click', () => {
//      // urlToFile(image.src, 'Happy-Eid.jpg').then(res => {
//      //   navigator.share({
//      //     title: 'Happy Eid',
//      //     text: 'Happy Eid!',
//      //     files: [res]
//      //   }).then(() => console.log('Shared successfully'))
//      // })
//      navigator.share({
//        title: 'Happy Eid',
//        files: [shareFile]
//      })
//    })
    
    function resizeCanvas(origCanvas, width, height) {
        let resizedCanvas = document.createElement("canvas");
        let resizedContext = resizedCanvas.getContext("2d");
     
        resizedCanvas.height = height;
        resizedCanvas.width = width;
     
        resizedContext.drawImage(origCanvas, 0, 0, width, height);
        return resizedCanvas.toDataURL();
    }
     
    document.getElementById("shutterButton").addEventListener("click", function() {

        //console.log("clicking shutter button at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        $('.flash').show().animate({opacity: 1}, 300) 
        closeButton.addEventListener('click', promptKeep)
        let sceneHeight = $(window).height()
        let sceneWidth = $(window).width()
        // console.log(sceneHeight)
        // console.log(sceneWidth)
        // let sceneHeightHalf = sceneHeight/2
        // let sceneWidthHalf = sceneWidth/2
              // Show the photo
              container.classList.add('photo')
              canvas.classList.add('blur')
              audioButton.style.display = 'none'
              photoFrame.style.display = 'none'

        //console.log("getting canvas screenshot at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        let scene = document.querySelector("a-scene")
        scene.setAttribute('screenshot', {
          width: sceneWidth * 3,
          height: sceneHeight * 3
        })
        // console.log(scene.components.screenshot.height + ' ' + scene.components.screenshot.width)
        let aScene = scene.components.screenshot.getCanvas("perspective");
        // console.log("ascene height: " + aScene.height)
        // console.log("ascene width: " + aScene.width)
        aSceneWidth = aScene.width;
        aSceneHeight = aScene.height;
        let aSceneOrig = document.querySelector("a-canvas")
        //let santaSelfie = document.getElementById("santaSelfie")
        // let actualFrameHeight = 0
        //console.log("capturing video frame at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        let frame = captureVideoFrame("video", "jpeg");
        let selfieContainer = document.getElementById('selfieContainer')




        // console.log("window height: " + sceneHeight)
        // console.log("window width: " + sceneWidth)
        // console.log("frame height: " + frame.height)
        // console.log("frame width: " + frame.width)
        //console.log("frame width: " + frame.style.width)
        // console.log("actual frame height: " + actualFrameHeight)
        //console.log("resizing ascene canvas frame at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        aScene = resizeCanvas(aScene, sceneWidth*2, sceneHeight)
        //console.log("finished ascene resizing canvas frame at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        aSceneWidth = frame.height*(aSceneWidth/aSceneHeight)
        aSceneHeight = frame.height
        console.log("adjusted ascene height: " + frame.height)
        //console.log("adjusted ascene height: " + aScene.height)
        // console.log("adjusted ascene width: " + (frame.height*(aSceneWidth/aSceneHeight))*.75)
        //console.log("resizing canvas frame at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        //var santaSelfie = new Image()
        var santaSelfie = '/graphics/SantaSelfiepng.png'

        //console.log("frinished resizing canvas frame at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        frame = frame.dataUri;

        photoHasBeenTaken = true;
         // console.log("merging images at " + new Date().toLocaleTimeString() + " ." + new Date().getMilliseconds())
        // console.log("selfie mode is:" + el.getAttribute('selfieMode'))
        if(el.getAttribute('selfieMode') == "true") {
          console.log("merging with selfie frame")
            mergeImages( [
              {src: frame, x: -(frame.width/3), y: 0},
              //{src: aScene, x: -(sceneWidth/2), y: 0}, 
              //TODO figure out how to get the selfie to show up correctly
              {src: santaSelfie, x: sceneWidth-371, y: (frame.height-721)},
              {src: '/graphics/sixtytwo_small.png', x: 0, y: (frame.height-721)}], {//, '/graphics/SantaSelfie.gif'], {
              width: sceneWidth,
              height: 721, 
              quality: 1
            }).then(b64 => {
              // Hide the flash
              //container.classList.remove('flash')
              // If an error occurs while trying to take the screenshot, e.detail will be empty.
              // We could either retry or return control to the user
              if (!b64) {
                return
              }
              // e.detail is the base64 representation of the JPEG screenshot
              var basestr = b64 //'data:image/jpeg;base64,' + e.detail
              urlToFile(basestr, 'Merry-Christmas.jpg')
                .then(res => {
                  shareFile = res
                  imageUrl = URL.createObjectURL(res)
                }).then(() => {
                  image.src = imageUrl
                })
                
              
              // Show the photo
              container.classList.add('photo')
              canvas.classList.add('blur')
              audioButton.style.display = 'none'
              photoFrame.style.display = 'none'
              
              // Tell the restart-camera script to start watching for issues
              window.dispatchEvent(new Event('ensurecamerastart'))
              // console.log(b64)
            });
        } else {
          console.log("merging without selfie frame")
            mergeImages( [
              {src: frame, x: -(frame.width/3), y: 0},
              {src: aScene, x: -(sceneWidth/2), y: 0}, 
              {src: '/graphics/sixtytwo_small.png', x: 0, y: 0}], {//, '/graphics/SantaSelfie.gif'], {
              width: sceneWidth,
              height: frame.height, 
              quality: 1
            }).then(b64 => {
              // Hide the flash
              //container.classList.remove('flash')
              // If an error occurs while trying to take the screenshot, e.detail will be empty.
              // We could either retry or return control to the user
              if (!b64) {
                return
              }
              // e.detail is the base64 representation of the JPEG screenshot
              var basestr = b64 //'data:image/jpeg;base64,' + e.detail
              urlToFile(basestr, 'Merry-Christmas.jpg')
                .then(res => {
                  shareFile = res
                  imageUrl = URL.createObjectURL(res)
                }).then(() => {
                  image.src = imageUrl
                })
                
              

              
              // Tell the restart-camera script to start watching for issues
              window.dispatchEvent(new Event('ensurecamerastart'))
              //Show the b64 data
              ////console.log(b64)
            });
            }// $('.flash').fadeOut(300).css({'opacity': 1}); }
                        $('.flash').fadeOut(300).css({'opacity': 1}); 


        
    });

    function captureVideoFrame(video, format, width, height) {
        // if (typeof video === 'string') {
        //   //we select the video source of the camera, not the other videos
            video = document.getElementById('arjs-video');
            videoStyleWidth = parseInt(video.style.width , 10)
            videoStyleHeight = parseInt(video.style.height, 10)
            // console.log("video style width: " + videoStyleWidth)
            // console.log("video style height: " + videoStyleHeight)
        // }
        // format = format || 'jpeg';
 
        // if (!video || (format !== 'png' && format !== 'jpeg')) {
        //     return false;
        // }
        // console.log("video widht: " + video.videoWidth + "  Video height: " + video.videoHeight)
        var canvas = document.createElement("CANVAS");
        canvas.width = width || videoStyleWidth
        canvas.height = height || videoStyleHeight
        canvas.getContext('2d').drawImage(video, 0, 0);
        var dataUri = canvas.toDataURL('image/' + format, 1);
        var data = dataUri.split(',')[1];
        var mimeType = dataUri.split(';')[0].slice(5)
 
        var bytes = window.atob(data);
        var buf = new ArrayBuffer(bytes.length);
        var arr = new Uint8Array(buf);
 
        for (var i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
        }
        var blob = new Blob([ arr ], { type: mimeType });
        return { blob: blob, dataUri: dataUri, format: format, width: videoStyleWidth, height: videoStyleHeight };
    };

    shareButton.addEventListener('click', () => {
      
      if (navigator.canShare && navigator.canShare({files :[shareFile]} )) {
        navigator.share({
          files: [shareFile],
          title: 'Merry Christmas!',
          text: 'Merry Christmas from sixtytwo.co!',
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.log('Sharing failed', error));
      } else {
        shareBlurbAlt.style.display = 'block'
        shareBlurb.hidden = true
        shareButton.hidden = true
        retakeButton.classList.add('solo')
        console.log(`Your browser doesn't support one tap share. Long-press the picture to share it.`);
      }
      // selfie_frame.setAttribute('visible', false)
    })

  }
})