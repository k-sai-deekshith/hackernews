import { useState, useEffect } from 'react';
import './App.css';
import logo from "./logo.svg"
import * as cheerio from 'cheerio';


interface navLinkInterface {
  name: string,
  url: string
}

interface PostData {
  ranking: string;
  title: string;
  url: string;
  link: string;
  points: string;
  author: string;
  timePosted: string;
  hideLink: string;
  commentsLink: string;
}

function App() {

  const [posts, setPosts] = useState<PostData[]>([]);

  const navlinks: navLinkInterface[] = [
    { name: "new", url: "https://news.ycombinator.com/newest" },
    { name: "past", url: "https://news.ycombinator.com/front" },
    { name: "comments", url: "https://news.ycombinator.com/newcomments" },
    { name: "ask", url: "https://news.ycombinator.com/ask" },
    { name: "show", url: "https://news.ycombinator.com/show" },
    { name: "jobs", url: "https://news.ycombinator.com/jobs" },
    { name: "submit", url: "https://news.ycombinator.com/submit" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api");
      const html = await response.text();
      const $ = cheerio.load(html);
      const extractedPosts: PostData[] = [];

      $('tr.athing').each(function () {
        const ranking = $(this).find('.rank').text().trim();
        const title = $(this).find('.titleline > a').text().trim();
        const link = $(this).find('.titleline > a').attr('href') || '';
        const site = $(this).find('.sitestr').text().trim();
        const url = site ? `${site}` : ''; // Format the abbreviated URL
        const nextRow = $(this).next('tr');
        const points = nextRow.find('.score').text().trim();
        const author = nextRow.find('.hnuser').text().trim();
        const timePosted = nextRow.find('.age').text().trim();
        const hideLink = nextRow.find('a:contains("hide")').text().trim();
        const commentsLink = nextRow.find('a:contains("comments")').text().trim();

        const postData: PostData = {
          ranking,
          title,
          url,
          link,
          points,
          author,
          timePosted,
          hideLink,
          commentsLink,
        };

        extractedPosts.push(postData);
      });
      console.log(extractedPosts)
      setPosts(extractedPosts);
    }
    fetchData();
  }, [])

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "85%" }}>
        <div className='pagetop' style={{ backgroundColor: "#ff6600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} style={{ border: "1px solid white", margin:"2px"}}></img>
            <span style={{ paddingLeft: "5px", fontWeight: "bold" }}> Hacker News</span>
            {navlinks.length ? (
              navlinks.map((nav: navLinkInterface, index: number) => (
                <span>
                  <a style={{ paddingRight: "5px", paddingLeft: "5px" }} href={nav.url}>{nav.name}</a>
                  {navlinks.length - 1 === index ? "" : <span>|</span>}
                </span>
              ))
            ) : (
              <p> No Links</p>
            )}
          </div>
          <div>
            <span style={{ marginRight: "5px" }}> login</span>
          </div>
        </div>
        <div style={{ backgroundColor: "#f6f6ef", paddingTop: "5px" }}>
          {posts.map((post: PostData, index: number) => (
            <div key={index} style={{ marginTop: "10px", marginLeft: "5px" }}>
              <div className='title'>
                <span>{post.ranking}</span>
                <a href={post.link}><span>{post.title}</span></a>
                <a className='comhead' href={"https://" + post.url}> ({post.url})</a>
              </div>
              <div className='subtext'>
                {post.points} by {post.author} {post.timePosted} | hide | {post.commentsLink ? post.commentsLink : "discuss"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
