document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.removeAttribute("data-theme");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  themeToggle.addEventListener("click", function () {
    if (document.body.hasAttribute("data-theme")) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
  const langButtons = document.querySelectorAll(".lang-btn");
  let currentLang = localStorage.getItem("language") || "pt";
  setLanguage(currentLang);
  langButtons.forEach((btn) => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.dataset.lang;
      setLanguage(lang);
      localStorage.setItem("language", lang);
      langButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
  function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    const translations = {
      pt: {
        "nav.home": "Início",
        "nav.about": "Sobre",
        "nav.services": "Serviços",
        "nav.contact": "Contato",
        "hero.title": "Transformando Ideias em Realidade Digital",
        "hero.subtitle":
          "Soluções inovadoras para o seu negócio com tecnologia de ponta e design excepcional.",
        "hero.cta1": "Comece Agora",
        "hero.cta2": "Saiba Mais",
        "hero.image_alt": "Robô Wall-E representando tecnologia",
        "features.title": "Nossos Diferenciais",
        "features.1.title": "Performance",
        "features.1.desc":
          "Aplicações otimizadas para máxima velocidade e eficiência.",
        "features.2.title": "Design",
        "features.2.desc":
          "Interfaces intuitivas e visualmente impressionantes.",
        "features.3.title": "Segurança",
        "features.3.desc":
          "Proteção de dados com os mais altos padrões de segurança.",
        "footer.copyright": "© 2025 WALL-E. Todos os direitos reservados.",
      },
      en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.contact": "Contact",
        "hero.title": "Turning Ideas into Digital Reality",
        "hero.subtitle":
          "Innovative solutions for your business with cutting-edge technology and exceptional design.",
        "hero.cta1": "Get Started",
        "hero.cta2": "Learn More",
        "hero.image_alt": "Wall-E robot representing technology",
        "features.title": "Our Features",
        "features.1.title": "Performance",
        "features.1.desc":
          "Optimized applications for maximum speed and efficiency.",
        "features.2.title": "Design",
        "features.2.desc": "Intuitive and visually stunning interfaces.",
        "features.3.title": "Security",
        "features.3.desc":
          "Data protection with the highest security standards.",
        "footer.copyright": "© 2025 WALL-E. All rights reserved.",
      },
      zh: {
        "nav.home": "首页",
        "nav.about": "关于",
        "nav.services": "服务",
        "nav.contact": "联系",
        "hero.title": "将想法转化为数字现实",
        "hero.subtitle": "利用尖端技术和卓越设计为您的企业提供创新解决方案。",
        "hero.cta1": "立即开始",
        "hero.cta2": "了解更多",
        "hero.image_alt": "代表科技的Wall-E机器人",
        "features.title": "我们的特点",
        "features.1.title": "性能",
        "features.1.desc": "优化的应用程序可实现最大速度和效率。",
        "features.2.title": "设计",
        "features.2.desc": "直观且视觉震撼的界面。",
        "features.3.title": "安全",
        "features.3.desc": "采用最高安全标准的数据保护。",
        "footer.copyright": "© 2025 WALL-E。保留所有权利。",
      },
    };
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        if (element.getAttribute("data-i18n").startsWith("[alt]")) {
          element.setAttribute("alt", translations[lang][key]);
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });
    document.documentElement.lang = lang;
  }
});
