import React, { Component } from "react";

export default class About extends Component {
  render() {
    return (
      <div className="about-container">
        <div style={{ paddingTop: "1.5rem" }}>
          <h2>The website:</h2>
          <p>
            This is a weather app which allows a user to find the current
            weather conditions in various cities around the world, a user can
            use maximum 10 cities at a time, once a user added their own
            choices, if the user comes back to the website he/she will see their
            previous choices because those are stored in a cookie.
          </p>
          <h2>CSS loader</h2>
          <p>
            Thanks to zbryikt for the beautiful CSS loader, GitHub{" "}
            <a href="https://github.com/zbryikt" target="_blank">
              here
            </a>{" "}
            and website{" "}
            <a href="https://loading.io/css/" target="_blank">
              here
            </a>
          </p>
          <h2>Image Resources:</h2>
          <p>
            <b>
              Thanks to the free content provided on{" "}
              <a target="blank" href="https://www.pexels.com/">
                Pexels
              </a>{" "}
              and{" "}
              <a target="blank" href="https://unsplash.com/">
                Unsplash
              </a>{" "}
              some nice pictures were added which can be seen as part of the
              cards for weather conditions
            </b>{" "}
          </p>
          <h3>
            The content of the following users was used, if interested head to
            their profile
          </h3>
          <p>
            <a
              target="blank"
              href="https://www.pexels.com/@andree-brennan-974943"
            >
              Andree Brennan
            </a>{" "}
            from Pexels
          </p>
          <p>
            <a target="blank" href="https://unsplash.com/@kerber">
              Marko Blažević
            </a>{" "}
            on Unsplash
          </p>
          <p>
            <a target="blank" href="https://unsplash.com/@mischievous_penguins">
              Casey Horner
            </a>{" "}
            on Unsplash
          </p>
          <p>
            <a target="blank" href="https://www.pexels.com/@splitshire">
              SplitShire
            </a>{" "}
            from Pexels
          </p>
          <p>
            <a target="blank" href="https://www.pexels.com/@jplenio">
              Johannes Plenio
            </a>{" "}
            from Pexels
          </p>
          <p>
            <a target="blank" href="https://unsplash.com/@r_shayesrehpour">
              reza shayestehpour
            </a>{" "}
            on Unsplash
          </p>
          <p>
            <a target="blank" href="https://www.pexels.com/@8moments">
              Simon Matzinger
            </a>{" "}
            from Pexels
          </p>
          <p>
            <a target="blank" href="https://www.pexels.com/@amychandra">
              Amy Chandra
            </a>{" "}
            from Pexels
          </p>
          <h3>Also for app icons:</h3>
          <p>
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              {" "}
              www.flaticon.com
            </a>
          </p>
        </div>
      </div>
    );
  }
}
