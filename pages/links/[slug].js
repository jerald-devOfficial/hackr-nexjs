import { useState, useEffect, Fragment } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { Interweave } from "interweave";
import moment from "moment";
import { API, APP_NAME } from "../../config";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      <meta property="og:title" content={category.name} />
      <meta
        property="og:description"
        content={stripHTML(category.content.substring(0, 160))}
      />
      {/* to include image when sharing to social media platforms like Facebook */}
      <meta property="og:image" content={category.image.url} />
      <meta property="og:image:secure_url" content={category.image.url} />
    </Head>
  );

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const handleClickPopular = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const listOfPopularLinks = () =>
    popular.map((l, i) => (
      <div key={i} className="row alert alert-secondary p-2">
        <div className="col-md-8" onClick={() => handleClickPopular(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>

        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy?.name ?? "unknown"}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
      </div>
    ));

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <br />
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
        </div>
      </div>
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    console.log("allLinks: ", allLinks);
    console.log("response.data.links.length: ", response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  /*   const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button className="btn btn-outline-primary btn-lg" onClick={loadMore}>
          Load more
        </button>
      )
    );
  }; */

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <h1 className="display-4 font-weight-bold">
              {category.name} - URL/Links
            </h1>
            <div className="lead alert alert-secondary pt-4">
              <Interweave content={category.content || ""} />
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px" }}
            />
          </div>
        </div>
        <br />
        {/* <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most popular in {category.name}</h2>
          <p>Show popular links</p>
        </div>
      </div> */}

        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <img key={0} src="/images/loading.gif" alt="loading" width={50} />
          }
        >
          <div className="row">
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              <h2 className="lead">Most popular in {category.name}</h2>
              <div className="p-3">{listOfPopularLinks()}</div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </Fragment>
  );
};

Links.getInitialProps = async ({
  query,
  req,
}) /* query and req is coming from context object, see getInitialProps documentation */ => {
  let skip = 0;
  let limit = 2;

  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });

  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
