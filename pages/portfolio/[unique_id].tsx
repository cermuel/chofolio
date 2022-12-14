import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Portfolio.module.css";
import { Portfolio, Repo } from "../../types";
import { RiGitRepositoryLine } from "react-icons/ri";
import { BsBoxArrowUpRight } from "react-icons/bs";
import Image from "next/image";
import { useRouter } from "next/router";

const NewProfile = ({ data }: any) => {
  const router = useRouter();
  const { unique_id } = router.query;
  const [avatar, setavatar] = useState<string>("");
  const [user, setuser] = useState<Portfolio>();
  const [repos, setrepos] = useState<any>();
  const [showdescription, setshowdescription] = useState<boolean>(false);
  const [reposUrl, setreposUrl] = useState<string>("");
  const [loading, setloading] = useState<boolean>(true);
  const [pageAvailable, setpageAvailable] = useState(true);
  useEffect(() => {
    setuser(data);
    const getGithubRepoData = async () => {
      axios
        .get(`https://api.github.com/users/${data?.github_username}/repos`)
        .then((res) => {
          console.log(res.data);
          setrepos(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getGithubData = async () => {
      axios
        .get(`https://api.github.com/users/${data?.github_username}`)
        .then((res) => {
          console.log(res.data);
          setavatar(res.data.avatar_url);
          setreposUrl(res.data.html_url + "?tab=repositories");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setloading(false));
    };
    getGithubData();
    getGithubRepoData();

    const checkPage = async () => {
      await data;
      if (!data) {
        setpageAvailable(false);
      }
    };
    checkPage();
  }, [data]);

  const copy = (text: string) => navigator.clipboard.writeText(text);
  const copyLink = () => {
    copy(`https://chofolio.vercel.app/portfolio/${unique_id}`);
    alert("Link copied to clipboard");
  };

  if (pageAvailable === false) {
    return (
      <h1
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          textAlign: "center",
          fontSize: "1.2em",
        }}
      >
        Portfolio Not Available
      </h1>
    );
  } else if (pageAvailable === true) {
    if (loading === true) {
      return (
        <>
          <div className={styles.loader}></div>
        </>
      );
    }
    if (loading === false) {
      return (
        <div className={styles.portfolio}>
          <div className={styles.portfolioContainer}>
            <div className={styles.basic}>
              <img src={avatar} alt="Profile" />

              <div className={styles.extra}>
                <div className={styles.name}>{user?.name}</div>
                <div className={styles.username}>@{user?.username}</div>
                <div className={styles.role}>{user?.role}</div>
              </div>
            </div>

            <div className={styles.header}>About Me</div>
            <div className={styles.about}>{user?.about}</div>

            <div className={styles.header}>Tech Stack</div>
            <div className={styles.techStackContainer}>
              {user?.skills.map((val, key: number) => {
                return (
                  <div className={styles.tech} key={key}>
                    <div className={styles.techName}>{val.language}</div>
                    <div className={styles.techLevel}>{val.level}</div>
                  </div>
                );
              })}
            </div>

            <div className={styles.header}>WORK Experience</div>

            {user?.workXP?.length == 0 ? (
              <div className={styles.workContainer}>
                No work experience available
              </div>
            ) : (
              <div className={styles.workContainer}>
                {user?.workXP?.map((val, key: number) => {
                  return (
                    <div className={styles.work} key={key}>
                      <div className={styles.title}>{val.title}</div>
                      <div className={styles.company}>{val.company}</div>
                      <div className={styles.date}>
                        {val.start} - {val.end}
                      </div>
                      <button
                        className={styles.handleDesc}
                        onClick={() => setshowdescription(!showdescription)}
                      >
                        See {showdescription ? "less" : "more"}
                      </button>
                      {showdescription ? (
                        <div className={styles.description}>
                          {val.description}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.repoHeader}>
              <div>Repositories</div>{" "}
              <a href={reposUrl} target="blank">
                <BsBoxArrowUpRight />
              </a>
            </div>

            <div className={styles.repoContainer}>
              {repos?.slice(0, 6).map((val: Repo, key: number) => {
                return (
                  <div className={styles.repo} key={key}>
                    <div className={styles.repoName}>
                      <RiGitRepositoryLine />
                      <a href={val.html_url}>{val.name}</a>
                    </div>
                    <div className={styles.repoDescription}>
                      {val.description}
                    </div>

                    <div className={styles.language}>
                      <div></div>
                      {val.language}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.footer}>
            Copyright &copy; {new Date().getFullYear()} {user?.name}
          </div>
          <button className={styles.copyLink} onClick={copyLink}>
            Copy Portfolio Link
          </button>
          <div className={styles.cermuel}>
            <a href="https://cermuel.vercel.app/" target="blank">
              <span className={styles.one}>Want</span> a{" "}
              <span className={styles.two}>Custom</span>{" "}
              <span className={styles.three}>Template?</span>
            </a>
          </div>
        </div>
      );
    }
  }
};

export default NewProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  console.log(params);
  const res = await fetch(
    `https://chofolio.vercel.app/api/user/${params?.unique_id}`
  );
  const data = await res.json();
  return {
    props: { data },
  };
};
