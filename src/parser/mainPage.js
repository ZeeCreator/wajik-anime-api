import axios from "axios";
import * as cheerio from "cheerio";
import { BASEURL } from "../helpers/index.js";

const mainPage = async (pathName, page = 1) => {
  const response = await axios.get(`${BASEURL}${pathName}${page}`),
    $ = cheerio.load(response.data),
    maxPage = $(".pagin .page-numbers:not(.prev,.next,.dots):last")
      .text()
      .replace(/,| /g, ""),
    list = [];

  $(".tab-content .flw-item").each((i, el) => {
    const url = $(el).find("a.film-poster-ahref").attr("href"),
      slug = url.split("/")[url.split("/").length - 2],
      title = $(el).find("h3.film-name a").text(),
      poster = $(el).find(".film-poster img").attr("data-src"),
      star = $(el).find(".tick.ltr div").text().trim(),
      episodeOrType = $(el).find(".tick.rtl div").text().trim(),
      dataList = {
        url,
        slug,
        title,
        poster,
        star,
      };

    pathName.includes("anime") || pathName.includes("ongoing")
      ? (dataList.episode = episodeOrType)
      : (dataList.type = episodeOrType);

    list.push(dataList);
  });

  const data = {
    statusCode: 200,
    currentPage: ~~page,
    maxPage: ~~maxPage === 0 ? 1 : ~~maxPage,
    list,
  };

  if (~~page < 1) throw new Error("Page not found");

  return data;
};

export default mainPage;
