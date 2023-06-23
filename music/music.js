/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/pause/seek
 * 4. D rotate
 * 5. Next/prev
 * 6. randoms
 * 7. Next / Repeat when ended
 * 8. Active Song
 * 9. Scroll active song into view
 * 10. Play song with click
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading =$('header h2')
const cdThumb =$('.cd-thumb')
const audio = $('#audio') 
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
    songs: [
    {
      name: "Lời Cảnh Cáo",
      singer: "OSAD",
      path: "LỜI CÓ CÁNH - OSAD _ RUNG ĐỘNG EP (Official M_V)_fRb8Ch6cN_w.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "2AM",
      singer: "JustaTee feat Big Daddy",
      path: "2AM - JustaTee  feat Big Daddy Official Audio_XGrvLJG8tuM.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    
    {
      name: "Như Anh Đã Thấy Em",
      singer: "PHUCXP",
      path:
        "PHUCXP - Như Anh Đã Thấy Em (CTTDE 2) _ OFFICIAL VIDEO_cPbp2iFaZRo.mp3",
      image:
        "nhuanh.jpg"
    },
    
],
     render: function()
     {
       const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}"}>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
        </div>
        <div class="option">
        <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>
        `
        // khi mà chuyển bài khác tự mất active
       })
         playList.innerHTML = htmls.join('')
     },
     defineProperties : function() {
      //Phương thức static Object.defineProperty()định 
      //nghĩa một thuộc tính mới trực tiếp 
      //trên một đối tượng hoặc sửa đổi một 
      //thuộc tính hiện có trên một đối tượng và trả về đối tượng.
        // cú pháp 
        //Object.defineProperty(obj, prop, descriptor)
        /**
         * obj
          Đối tượng để xác định thuộc tính.

            prop
            Tên hoặc Symbolthuộc tính được xác định hoặc sửa đổi.

            descriptor
            Bộ mô tả cho thuộc tính đang được xác định hoặc sửa đổi.
         */
        //ví dụ 
         Object.defineProperty(this,'currentSong', {
          get: function() {
            return this.songs[this.currentIndex]
          }
         })
     },
     handleEvents: function()
     {        
              
              const cdWidth = cd.offsetWidth 
              // xử lý phóng to / thu nhỏ CD
            document.onscroll = function()
            {
                const scrollTop =  window.scrollY || window.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                cd.style.width =newCdWidth>0 ? newCdWidth +'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
                //opacity độ trong suốt của hình ảnh có giá trị từ 0->1 trong đó 1 là đậm nhất
                //xảy ra khi người dùng cuộn chuột (di chuyển con lăn chuột). 
                //Sự kiện này xảy ra liên tục trong quá trình cuộn chuột. Và sự kiện này phát sinh trên các window Object trong JavaScript.
            }
            // xử lý khi click play
            playBtn.onclick = function()
            {       
                  if(app.isPlaying)
                  {
                    audio.pause()
                  }
                  else {
                    audio.play()
                  }
                  // khi ấn chuột thì isPlaying từ false thành true trong else
                  // và ấn ngc lại true thành false
                }
                  //khi song dc play
                audio.onplay = function(){
                  app.isPlaying = true 
                   player.classList.add('playing')
                   // khi song bi pause
               }
               audio.onpause = function() {
                  app.isPlaying = false
                   player.classList.remove('playing')
               }
                  
               //làm cho thanh cuộn chạy khi video chạy
                 audio.ontimeupdate = function()
                 {
                  if(audio.duration)
                  {
                      const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                      //trả về số % hoàn thành của audio/video 
                      //ví dụ video đang chạy đc 15% của video và chạy cho đến khi hết video
                     progress.value = progressPercent
                    }
                }
                // xử lý khi tua song
                progress.onchange = function(e) {
                    const seekTime = (audio.duration * e.target.value /100)
                    //công thức tính ra số thời gian của video khi tua
                    //e.target.value là tiến độ % đã chạy của video từ (tùy theo ta định mức cho thẻ element chạy từ bao nhiêu đến bao nhiêu)
                      audio.currentTime = seekTime
                  }
                  //khi next bài hát
                  nextBtn.onclick = function() {
                    if(app.isRandom)
                    {
                      // khi isRandom = true là đã bật chế độ random bài hát
                      // và ấn next cũng sẽ tự random bài hát 
                      app.playRandomSong()
                    }
                    else {
                      app.nextSong()
                    }
                    audio.play()
                    app.render()
                  }
                  //khi prev bài hát
                  prevBtn.onclick = function() {
                       if(app.isRandom) {
                        app.playRandomSong()
                       }
                   else {
                    app.prevSong()
                   }
                    audio.play()
                    app.render()
                  }
                  //ngẫu nhiên bài hát // bật tắt random
                  randomBtn.onclick = function() {
                    app.isRandom = !app.isRandom
                      randomBtn.classList.toggle('active',app.isRandom)
                      // biến toggle khi là true thì thêm vào flase sẽ mất đi
                 // khi click nút random chuyển đỏ và ngược lại kích lần nữa thì mất
                    }
                    //xử lý khi muốn bắt đầu lại bài hát đang nghe
                    repeatBtn.onclick = function()
                    {
                           app.isRepeat = !app.isRepeat
                           repeatBtn.classList.toggle('active',app.isRepeat)
                    }
                    //xử lý chuyển bài hát khi bài hát trước kết thúc
                    audio.onended = function()
                    {
                      // sự kiện khi bài hát kết thúc
                      if(app.isRepeat)
                      {
                        audio.play()
                        //khi isRepeat = true thì bài hát sẽ đc lặp đi lặp lại sau khi kết thúc
                      }
                      // cách 1
                         // nextBtn.click()
                      //cách 2 
                      else if(app.isRandom)
                      {
                        app.playRandomSong()
                      }
                      else {
                        app.nextSong()
                      }
                      audio.play()
                    }
                    //lắng nghe hành vi click vào playlist
                    playList.onclick = function(e)
                    {
                           let songNode = e.target.closest('.song:not(.active)')
                           if( songNode|| e.target.closest('.option'))
                              
                           // khi vẫn đang ở bài hát đang chạy thì sẽ ko thực hiện hành động lắng nghe
                           {
                            if(songNode)
                            {
                             // mục đích khi click vào bất cứ bài hát nào sẽ hiện ra số thứ tự bài hát 
                              app.currentIndex = Number(songNode.dataset.index)
                              // khi dataset ra thì sẽ thành chuỗi phải chuyển về số
                              app.loadCurrentSong()
                              audio.play()
                              app.render()
                            }
                          
                           }
                    }
                    
                   

     },

     loadCurrentSong: function() {
             
              heading.textContent = this.currentSong.name
              cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
              audio.src = this.currentSong.path
     },
     takPpictures: function() {
        const cdThumbAnimate =  cdThumb.animate([
            {transform:'rotate(360deg)'}
          ], {
            duration: 10000, // 10 giây
            iterations: Infinity
          } 
            )
            cdThumbAnimate.pause()
            //
            audio.onplay = function(){
              app.isPlaying = true 
               player.classList.add('playing')
               cdThumbAnimate.play()
               // khi song bi pause
           }
           audio.onpause = function() {
              app.isPlaying = false
               player.classList.remove('playing')
               cdThumbAnimate.pause()
           }
     },
     nextSong: function() {
           this.currentIndex++
           if(this.currentIndex >= this.songs.length)
           {
            this.currentIndex = 0
           }
           this.loadCurrentSong()
     },
     prevSong: function()
     {
           this.currentIndex--
           if(this.currentIndex < 0)
          {
             this.currentIndex = this.songs.length -1
          }
          this.loadCurrentSong()
     },
     playRandomSong: function() {
                let newIndex
               do {
                newIndex = Math.floor(Math.random()*this.songs.length)
               } while(newIndex === this.currentIndex)
               // vòng lặp kết thúc khi newIndex khác currentIndex
               // và khi newIndex = current index thì sẽ chạy tiếp vòng lặp do while
               this.currentIndex = newIndex
               this.loadCurrentSong()
     },
     start: function() {
      //định nghĩa các thuộc tính cho object
      this.defineProperties()
      //lắng nghe / xử lý sự kiện (DOM event) 
        this.handleEvents()
        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // Render playlist
        this.render()
        //xử lý khi cd quay / dừng
        this.takPpictures()
       
     }
    
    }
    app.start()


