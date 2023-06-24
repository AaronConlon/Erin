import "./style.css"

import githubIcon from "data-base64:~assets/github.svg"
import IconPng from "data-base64:~assets/icon.png"

function IndexPopup() {
  return (
    <div className="w-[400px] p-4 flex gap-4 justify-between items-center">
      <div className="group">
        <h3 className="text-lg text-purple-700 text-center mb-4">
          Just for fun.
        </h3>
        <a href="https://github.com/Developer27149" target="_blank">
          <img
            src={githubIcon}
            alt="github"
            className="w-6 inline-block group-hover:rotate-12 transition-all mr-2 group-hover:scale-105"
          />
          Developer27149
        </a>
      </div>
      <img src={IconPng} alt="logo" className="w-24" />
    </div>
  )
}

export default IndexPopup
