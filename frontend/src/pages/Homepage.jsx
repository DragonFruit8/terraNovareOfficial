import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';
import Meta from "../components/Meta"
import '../App.css'


export default function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0); // Force scroll to the top on page load
  }, []);
  return (
    <div>
      <Meta
        title="Terra'Novare"
        description="Default site description for SEO."
        keywords="your, business, keywords"
        url="https://terranovare.tech"
        image="https://terranovare.tech/default-image.jpg"
      />
      <div id="myCarousel" className="carousel slide">
    <div className="carousel-indicators">
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-label="Slide 1" aria-current="true"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    
    <div className="carousel-inner mb-5">
        <div className="carousel-item active">
            <img 
                src={"images/TerraNovareImage.jpg"} 
                alt="TerraNovare" 
                loading="lazy"
                style={{ width: '100%', height: '50vh', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div className="dark-overlay"></div>
            <div className="container">
                <div className="carousel-caption text-start">
                    <p className='mb-0'>Welcome to</p>
                    <h1 className='mt-0'>Terra'Novare</h1>
                    <p>We're looking forward to creating something spectacular for you to enjoy!</p>
                    <p><Link className="btn btn-lg btn-primary" to="mission">Our Mission</Link></p>
                </div>
            </div>
        </div>

        <div className="carousel-item">
            <img 
                src={"images/EFinityImage.jpg"} 
                alt="EFinity" 
                loading="lazy"
                style={{ width: '100%', height: '50vh', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div className="dark-overlay"></div>
            <div className="container">
                <div className="carousel-caption">
                    <h1>A Brand made with the <br/> Human Experience in mind</h1>
                    <p>Some representative placeholder content for the second slide of the carousel.</p>
                    <p><Link className="btn btn-lg btn-primary" to="brand">Learn More</Link></p>
                </div>
            </div>
        </div>

        <div className="carousel-item">
            <img 
                src={"images/SupportiveBrands.jpg"} 
                alt="TerraNovare" 
                loading="lazy"
                style={{ width: '100%', height: '50vh', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div className="dark-overlay"></div>
            <div className="container">
                <div className="carousel-caption text-end">
                    <h1>Products you would love.</h1>
                    <p>Some representative placeholder content for the third slide of this carousel.</p>
                    <p><Link className="btn btn-lg btn-primary" to="/shop">Shop Now</Link></p>
                </div>
            </div>
        </div>
    </div>

    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
    </button>
</div>


      <div className="container justify-items-center mt-5">

        <div id='mission' className="row featurette">
          <div className="col-md-7 p-3">
            <h2 className="featurette-heading">First featurette heading. <span className="text-muted">It’ll blow your mind.</span></h2>
            <p className="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>
          </div>
          <div className="col-md-5">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7 p-3 order-md-2">
            <h2 className="featurette-heading">Oh yeah, it’s that good. <span className="text-muted">See for yourself.</span></h2>
            <p className="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
          </div>
          <div className="col-md-5 order-md-1">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7 p-3">
            <h2 className="featurette-heading">And lastly, this one. <span className="text-muted">Checkmate.</span></h2>
            <p className="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
          </div>
          <div className="col-md-5">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

          </div>
        </div>

        <hr className="featurette-divider" />

        
        <div className="row">
          <div className="col-lg-4 p-3">
            <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

            <h2 className="my-4">Heading</h2>
            <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
            <p><Link className="btn btn-secondary" to="/">View details »</Link></p>
          </div>
          <div className="col-lg-4 p-3">
            <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

            <h2 className="my-4">Heading</h2>
            <p>Another exciting bit of representative placeholder content. This time, we've moved on to the second column.</p>
            <p><Link className="btn btn-secondary" to="/">View details »</Link></p>
          </div>
          <div className="col-lg-4 p-3">
            <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>

            <h2 className="my-4">Heading</h2>
            <p>And lastly this, the third column of representative placeholder content.</p>
            <p><Link className="btn btn-secondary" to="/">View details »</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
