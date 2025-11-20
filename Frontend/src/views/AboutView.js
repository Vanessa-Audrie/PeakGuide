export class AboutView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render(mountains) {
    this.app.innerHTML = `
            <header>
                <nav-bar></nav-bar>
            </header>

            <section class="hero" style="background-image: url('${require("../assets/images/cartenz.jpg")}')" aria-label="Hero section">
                <div class="hero-content">
                    <h1 style="color: #f5f5f5;">PeakGuide</h1>
                    <p>PeakGuide adalah platform digital yang menyediakan informasi lengkap tentang gunung-gunung di seluruh Indonesia. Melalui situs ini, pengguna dapat mengetahui lokasi, kondisi cuaca terkini, serta tingkat kesulitan pendakian untuk membantu perencanaan perjalanan yang aman dan menyenangkan.</p>
                </div>
            </section>

            <main>
            <div class="section-title">
            <h1 style="padding-top: 50px;">MENGAPA WEBSITE INI DICIPTAKAN?</h1>
            </div>

                <section class="AboutView-section" aria-labelledby="">
                  <div class="content-block">
                    <h2 id="">Popularitas Mendaki dan Tantangan Perencanaan</h2>
                    <p class="AboutView-p-left">Mendaki gunung telah menjadi kegiatan yang sangat digemari di Indonesia.  Namun, popularitas ini tidak selalu diimbangi dengan kemudahan akses informasi yang terpadu. Banyak pendaki, terutama pemula, kesulitan menemukan detail penting seperti kondisi cuaca terkini di gunung, tingkat kesulitan jalur yang sebenarnya, dan perkiraan waktu tempuh yang akurat.  Informasi yang ada seringkali tersebar di berbagai platform, tidak terstandardisasi, dan kadang kurang dapat diandalkan.</p>
                  </div>
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/1.png")}" alt="people climbing the mountain">
                  </div>
                </section>

                <section class="AboutView-section" id="AboutView-section-reverse" aria-labelledby="">
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/2.png")}" alt="people climbing the mountain">
                  </div>
                  <div class="content-block">
                    <h2 id="">Risiko Keselamatan dan Kurangnya Kesiapan</h2>
                    <p class="AboutView-p-left">Akibat minimnya informasi yang komprehensif, banyak pendaki berangkat dengan persiapan yang kurang matang atau memilih gunung yang tingkat kesulitannya tidak sesuai dengan kemampuan fisik dan pengalaman mereka.  Hal ini tidak hanya mengurangi kenyamanan dan kenikmatan pendakian tetapi juga dapat meningkatkan risiko insiden atau masalah keselamatan selama di gunung.</p>
                  </div>
                </section>

                <section class="AboutView-section" aria-labelledby="">
                  <div class="content-block">
                    <h2 id="">Keterbatasan Akses terhadap Informasi Gunung yang Terpadu</h2>
                    <p class="AboutView-p-left">Informasi mengenai gunung di Indonesia masih tersebar di berbagai sumber dan sering kali tidak terbarui. Website ini hadir sebagai pusat data terpadu yang menyajikan lokasi, cuaca, dan tingkat kesulitan pendakian secara komprehensif. Semua dirancang agar pendaki dapat memperoleh gambaran yang jelas sebelum menapakkan langkah pertama ke jalur pendakian.</p>
                  </div>
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/3.png")}" alt="compas">
                  </div>
                </section>

                <section class="AboutView-section" id="AboutView-section-reverse" aria-labelledby="">
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/4.png")}" alt="people using map">
                  </div>
                  <div class="content-block">
                    <h2 id="">Mendorong Kesadaran dan Rasa Cinta terhadap Alam</h2>
                    <p class="AboutView-p-left">Selain menjadi panduan pendakian, website ini juga bertujuan menumbuhkan kesadaran akan pentingnya memahami alam sebelum menjelajahinya. Dengan mengenal karakteristik tiap gunung, pengguna dapat belajar menghargai dan menjaga kelestarian lingkungan pegunungan Indonesia.</p>
                  </div>
                </section>                
                    
                    <section class="fitur-unggulan-section">
                    <div class="section-title">
                        <h1>FITUR UNGGULAN HIPLAN</h1>
                    </div>
                    
                    <div class="AboutView-card-container">
                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/target_icon.png")}" alt="target_icon">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Informasi Gunung</h3>
                                <div class="AboutView-p-center">
                                    <p>Dapatkan data lengkap mengenai setiap gunung di Indonesia.</p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/weather_icon.png")}" alt="weather_icon">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Cuaca Terkini</h3>
                                <div class="AboutView-p-center">
                                    <p>Pantau kondisi cuaca harian di berbagai gunung sebelum melakukan pendakian. </p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/world-map.png")}" alt="world-map">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Peta Lokasi Gunung</h3>
                                <div class="AboutView-p-center">
                                    <p>Tampilkan persebaran gunung di Indonesia melalui peta sederhana yang informatif.</p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/lens_icon_2.png")}" alt="lens_icon_2">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Edukasi & Informasi</h3>
                                <div class="AboutView-p-center">
                                    <p>Dapatkan berbagai informasi seputar gunung di Indonesia.</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section class="tentang-kami-section">
                    <div class="section-title">
                        <h1>TENTANG KAMI</h1>
                    </div>
                    
                    <div class="team-container">
                        <div class="team-row team-row-first">
                            <div class="team-member">
                                <div class="member-avatar">
                                    <img src="${require("../assets/images/team/member1.png")}" alt="Team Member 1">
                                </div>
                                <h3>Vanessa Audrie Tanaka</h3>
                                <p class="member-role">Project Manager, Front End Developer</p>
                            </div>

                            <div class="team-member">
                                <div class="member-avatar">
                                    <img src="${require("../assets/images/team/member1.png")}" alt="Team Member 2">
                                </div>
                                <h3>Fathya Azra Nazmira</h3>
                                <p class="member-role">Back End Developer</p>
                            </div>

                            <div class="team-member">
                                <div class="member-avatar">
                                    <img src="${require("../assets/images/team/member1.png")}" alt="Team Member 3">
                                </div>
                                <h3>Faiza Adinda Fakhira Batubara</h3>
                                <p class="member-role">Documentation</p>
                            </div>
                        </div>

                        <div class="team-row team-row-second">
                            <div class="team-member">
                                <div class="member-avatar">
                                    <img src="${require("../assets/images/team/member1.png")}" alt="Team Member 4">
                                </div>
                                <h3>Nur Adilah</h3>
                                <p class="member-role">Maintenance</p>
                            </div>

                            <div class="team-member">
                                <div class="member-avatar">
                                    <img src="${require("../assets/images/team/member1.png")}" alt="Team Member 5">
                                </div>
                                <h3>Aini Maharani</h3>
                                <p class="member-role">Quality Assurance</p>
                            </div>
                        </div>
                    </div>
                </section>


            </main>

            <footer-component></footer-component>
        `;

    this.bindEvents();
  }

  renderMountainCards(mountains) {
    return mountains
      .map(
        (mountain) => `
            <article class="card">
                <img src="${require("../assets/images/" +
                  mountain.image)}" alt="Pemandangan ${mountain.name}" />
                <div class="card-content">
                    <h3>${mountain.name}</h3>
                    <p>${mountain.location}</p>
                    <p class="altitude">${mountain.altitude}</p>
                </div>
            </article>
        `
      )
      .join("");
  }

  bindEvents() {
    const searchForm = document.querySelector(".search-container");
    const searchInput = document.getElementById("searchInput");

    // Handle search form submission
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.onSearch) {
          this.onSearch(searchInput.value);
        }
      });
    }
  }

  setLoginHandler(handler) {
    this.onLogin = handler;
  }

  setRegisterHandler(handler) {
    this.onRegister = handler;
  }

  setSearchHandler(handler) {
    this.onSearch = handler;
  }

  updateSearchResults(mountains) {
    const containers = document.querySelectorAll(".card-container");
    containers.forEach((container) => {
      container.innerHTML = this.renderMountainCards(mountains);
    });
  }
}
