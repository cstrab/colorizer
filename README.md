<!-- PROJECT STATS -->
<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Coverage Status][coverage-shield]][coverage-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cstrab/colorizer">
    <img src="data/sample-logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">colorizer</h3>

  <p align="center">
    An application for recoloring images.
    <br />
    <a href="https://github.com/cstrab/colorizer/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/cstrab/colorizer/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#high-level-architecture">High Level Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Example](data/sample.gif)

colorizer allows users to recolor images by uploading a ZIP file containing .png images, selecting a color extension, and defining a series of color mappings to apply. A new ZIP file containing colored base images will be returned.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][react.js]][react-url]
* [![Python][python]][python-url]
* [![Golang][golang]][golang-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### High Level Architecture

This will be added as part of Phase 3 - Version 1.0

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

The following sections cover installation instructions using Docker Compose and Kubernetes

### Prerequisites - Docker Compose

1. Docker
2. Docker Compose

### Installation - Docker Compose

1. Clone the repository:
   ```sh
   git clone https://github.com/cstrab/colorizer.git
   ```
2. Go into colorizer folder:
   ```sh
   cd colorizer
   ```
3. Create .env file:
   ```sh
   cp .env.sample .env
   ```
4. Build and start project:
   ```sh
   docker compose up -d
   ``` 
5. Navigate to [localhost:3000](http://localhost:3000)
* Note: Sample data is provided in the data folder for testing

### Prerequisites - Kubernetes

1. Kubernetes
2. Helm

### Installation - Kubernetes

1. Clone the repository:
   ```sh
   git clone https://github.com/cstrab/colorizer.git
   ```
2. Go into colorizer folder:
   ```sh
   cd colorizer
   ```
3. Update values.yaml with your settings:
Note: i.e. specify imageTag (latest-arm64 (Mac) or latest-amd64 (Linux)) and server language (go or python)

4. Install helm chart:
   ```sh
   helm install colorizer ./chart
   ```
5. Port forward to access the application:
   ```sh
   kubectl port-forward svc/colorizer-client 3000:80
   ``` 
6. Navigate to [localhost:3000](http://localhost:3000)
* Note: Sample data is provided in the data folder for testing

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

* Image recoloring

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

### Phase 1:

Goal: Basic functionality


Stage: POC (Proof of Concept) - The app will be considered POC after this phase. Breaking changes are expected and more frequent during this phase. Unit test coverage is recommended, but there are no coverage requirements.


- [x] Client:
    - [x] Form containing sections for file upload, color extension, and mappings.
    - [x] Dockerfile
    - [x] Basic logging
- [x] Server (Python): 
    - [x] FastAPI with endpoint for /colorize
    - [x] Handler for colorize endpoint
    - [x] Data type validation
    - [x] Basic logging
    - [x] Dockerfile
- [x] Server (Go): 
    - [x] API setup with endpoint for /colorize
    - [x] Handler for colorize endpoint
    - [x] Data type validation
    - [x] Basic logging
    - [x] Dockerfile
- [x] Database: No requirements
- [x] Local Testing:
    - [x] Setup docker-compose for local testing
- [x] CI/CD:
    - [x] Automated docker image build and push to GitHub registry in CI pipeline
- [x] Deployment:
    - [x] Helm chart, values, and templates for Kubernetes deployment
- [x] General:
    - [x] README.md
    - [x] sample.gif 

- [x] Evaluation of POC:
    - N/A

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Phase 2:

Goal: Bug fixes, code refactoring, and optimizations


Stage: UAT (User Acceptance Testing) / Refactoring - Breaking changes are expected, but less frequent during this phase. Unit test coverage is recommended, but there are no coverage requirements.


- [ ] Client:
    - [ ] Refactoring
    - [ ] Improve alerts and logging
- [ ] Server (Python): 
    - [ ] Refactoring
    - [ ] Improve logging
    - [ ] Logging level fix
- [ ] Server (Go): 
    - [ ] Refactoring
    - [ ] Logging level fix
- [ ] Database: No requirements
- [ ] Local Testing: No requirements
- [ ] CI/CD: No requirements
- [ ] Deployment: No requirements
- [ ] General:
    - [ ] Update README.md with deployment instructions

- [ ] Evaluation of UAT / Refactoring:
    - N/A

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Phase 3: 

Goal: Initial release


Stage: Version 1.0 - The app with be considered Version 1.0 after this phase. Breaking changes are not expected during this phase, but bugs will recorded to resolve. Unit test coverage is required (80%) for Client and Server.


- [ ] Client:
    - [ ] Unit tests
- [ ] Server (Python): 
    - [ ] Unit Tests
- [ ] Server (Go): 
    - [ ] Unit Tests
- [ ] Database:
- [ ] Local Testing:
- [ ] CI/CD: 
    - [ ] Incorporate coveralls into CI/CD
- [ ] Deployment:
- [ ] General:
    - [ ] Coveralls setup
    - [ ] High level architecture diagram

- [ ] Evaluation of Version 1.0:
    - N/A

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Backlog / Future Considerations: 

- [ ] Client:
    - [ ] Dynamic preview of colorized images
- [ ] Server (Python):
    - [ ] Support other file types
    - [ ] Allow for single file uploads
- [ ] Server (Go):
    - [ ] Support other file types
    - [ ] Allow for single file uploads
- [ ] Database:
- [ ] Local Testing:
- [ ] CI/CD: 
- [ ] Deployment:
- [ ] General:

See the [open issues](https://github.com/cstrab/colorizer/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Curt Strab - cstrab@outlook.com

[![LinkedIn][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* N/A

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/cstrab/colorizer.svg?style=for-the-badge
[contributors-url]: https://github.com/cstrab/colorizer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cstrab/colorizer.svg?style=for-the-badge
[forks-url]: https://github.com/cstrab/colorizer/network/members
[stars-shield]: https://img.shields.io/github/stars/cstrab/colorizer.svg?style=for-the-badge
[stars-url]: https://github.com/cstrab/colorizer/stargazers
[issues-shield]: https://img.shields.io/github/issues/cstrab/colorizer.svg?style=for-the-badge
[issues-url]: https://github.com/cstrab/colorizer/issues
[license-shield]: https://img.shields.io/github/license/cstrab/colorizer.svg?style=for-the-badge
[license-url]: https://github.com/cstrab/colorizer/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/cstrab/
[product-screenshot]: images/screenshot.png
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[python-url]: https://python.org/
[golang]: https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white
[golang-url]: https://golang.org/
[coverage-shield]: https://img.shields.io/coveralls/github/cstrab/colorizer.svg?style=for-the-badge
[coverage-url]: https://coveralls.io/github/cstrab/colorizer?branch=main