const def_theme = JSON.parse('{"name":"","color":{"range":{"primary":{"h":222,"s":14}},"contrast":{"start":17,"end":83}},"accent":{"hsl":{"h":221,"s":100,"l":50},"rgb":{"r":0,"g":80,"b":255}},"font":{"display":{"name":"","weight":400,"style":"normal"},"ui":{"name":"","weight":400,"style":"normal"}},"background":{"type":"theme","color":{"hsl":{"h":221,"s":47,"l":17},"rgb":{"r":23,"g":36,"b":64}},"gradient":{"angle":160,"start":{"hsl":{"h":206,"s":16,"l":40},"rgb":{"r":86,"g":104,"b":118}},"end":{"hsl":{"h":219,"s":28,"l":12},"rgb":{"r":22,"g":28,"b":39}}},"image":{"url":"","blur":0,"grayscale":0,"scale":100,"accent":0,"opacity":100,"vignette":{"opacity":0,"start":90,"end":70}},"video":{"url":"","blur":0,"grayscale":0,"scale":100,"accent":0,"opacity":100,"vignette":{"opacity":0,"start":90,"end":70}}},"radius":25,"shadow":75,"style":"dark","shade":{"opacity":30,"blur":0},"opacity":{"general":100},"layout":{"color":{"by":"theme","hsl":{"h":0,"s":0,"l":0},"rgb":{"r":0,"g":0,"b":0},"blur":0,"opacity":10},"divider":{"size":0}},"header":{"color":{"by":"theme","hsl":{"h":0,"s":0,"l":0},"rgb":{"r":0,"g":0,"b":0},"opacity":10},"search":{"opacity":100}},"bookmark":{"color":{"by":"theme","opacity":10,"hsl":{"h":0,"s":0,"l":0},"rgb":{"r":0,"g":0,"b":0}},"item":{"border":0,"opacity":100}},"group":{"toolbar":{"opacity":100}},"toolbar":{"opacity":100}}')

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const hex_to_rgb = (a) => {
    arr = a.match(/([A-Fa-f0-9]{2})/g).map(s => parseInt(s, 16))
    return { r: arr[0], g: arr[1], b: arr[2] }
}

const clean_hsl = (hsl) => {
    arr = hsl.match(/\d+/g).map(s => parseInt(s))
    return { h: arr[0], s: arr[1], l: arr[2] }
}

const setCatppuccinColours = async() => {
    return fetch("https://raw.githubusercontent.com/catppuccin/palette/v0.2.0/palette.json")
        .then(async(resp) =>
            localStorage.setItem("catppuccin_colours", JSON.stringify(await resp.json()))
        )
}

const setTheme = async(theme, accent) => {
    if (localStorage.hasOwnProperty("catppuccin_colours") === false) {
        await setCatppuccinColours()
    }
    const colours = JSON.parse(localStorage.getItem("catppuccin_colours"))
    let cur_cfg = JSON.parse(localStorage.nightTab)

    const active = colours[theme]
    const accent_rgb = hex_to_rgb(active[accent].hex)
    const accent_hsl = clean_hsl(active[accent].hsl)
    const base_hsl = clean_hsl(active.base.hsl)
    const theme_name = capitalize(theme)
    const accent_name = capitalize(accent)

    let newConfig = {
        ...cur_cfg,
        state: {
            ...cur_cfg.state,
            theme: {
                ...cur_cfg.state.theme,
                custom: {
                    all: [
                        ...cur_cfg.state.theme.custom.all,
                        {
                            ...def_theme,
                            name: `Catppuccin ${theme_name} ${accent_name}`,
                            accent: {
                                hsl: accent_hsl,
                                rgb: accent_rgb
                            },
                            color: {
                                contrast: {
                                    start: base_hsl.l,
                                    end: accent_hsl.l + 25,
                                },
                                range: {
                                    primary: {
                                        h: base_hsl.h,
                                        s: base_hsl.s
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
    console.log(newConfig)
    localStorage.setItem("nightTab", JSON.stringify(newConfig))
}
