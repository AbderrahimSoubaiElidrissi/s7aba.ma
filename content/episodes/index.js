const cheerio = require('cheerio')

const rssURL = "https://anchor.fm/s/8da692c/podcast/rss"


const xml2json = (xml) => {
    const $ = cheerio.load(xml);
    $.prototype.getImage = function () {
        try {
            const regex = /<itunes:image href="(.+)">/gmi;
            const search = regex.exec(this.html())
            return search[1]
        } catch (error) {
            console.log(error)
        }
      };
    try {
        const episodes = $("item").map(
            function (item) {
                
                return {
                    guid: $(this).children("guid").text(),
                    title: $(this).children("title").text(),
                    published_at: $(this).children("pubDate").text(),
                    description: $(this).
                        children("description")
                        .text().replace(/(<([^>]+)>)/gi,""),
                    audio: $(this).children("enclosure").attr("url"),
                    image: $(this).getImage()
                };
            }
        ).get()
        return episodes
    } catch (e) {
        console.log(e.message);
    }
}


export const getEpisodes = async () => {
    const data = await fetch(rssURL);
    const result = await data.text();
    return xml2json(result)

}