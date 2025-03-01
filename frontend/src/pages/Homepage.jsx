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
                <div className="carousel-caption text-start mb-4">
                    <p className='mb-0'>Welcome to</p>
                    <h1 className='mt-0 fs-1'>Terra'Novare</h1>
                    <p>A Movement Toward Sustainability and Innovation</p>
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


      <div className="container-fluid justify-items-center mt-5">

      <section className="mission-section py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Our Mission</h2>
          <p className="lead">
            Terra'Novare stands as the guiding force behind E-Finity, ensuring its mission stays true while
            forging financial pathways and enterprise connections. We believe in a future where communities 
            and businesses collaborate for sustainable progress.
          </p>
        </div>
      </section>

        <hr className="featurette-divider" />

        <section className="impact-section py-5">
        <div className="container-fluid container-md text-center">
          <h3 className="fw-bold">The Impact We're Creating</h3>
          <p className="lead">
            We empower startups, drive local initiatives, and promote environmental stewardship. 
            Through strong community ties, we enable businesses and individuals to invest in meaningful change.
          </p>
          <div className="row mt-3">
            <div className="col-md-4">
              <img src="images/Golden Compass.png" alt="Guidance" className="img-fluid rounded mb-3" />
              <h4>Strategic Guidance</h4>
              <p>We provide a structured path for startups and sustainable enterprises.</p>
            </div>
            <div className="col-md-4">
              <img src="images/Gold.png" alt="Support" className="img-fluid rounded mb-3" />
              <h4>Community Support</h4>
              <p>Connecting businesses and individuals to create a thriving, interconnected world.</p>
            </div>
            <div className="col-md-4">
              <img src="images/Golden Door.png" alt="Opportunities" className="img-fluid rounded mb-3" />
              <h4>Endless Opportunities</h4>
              <p>Opening doors for those who are ready to take an active role in meaningful change.</p>
            </div>
          </div>
        </div>
      </section>

        <hr className="featurette-divider" />
        
        <section id="join-us" className="cta-section text-center text-white py-5">
        <div className="container">
          <h4 className="fw-bold">Ready to Make a Difference?</h4>
          <p className="lead">Become a part of the movement. Whether as a supporter, entrepreneur, or investor, your role is key.</p>
          <button id="joinBtn" href="/membership" className="btn">Get Involved</button>
        </div>
      </section>

      <section className="membership-section py-5">
        <div className="container text-start">
          <h4 className="fw-bold">Membership Coming Soon...</h4>
          <p className="lead">
            Exclusive benefits. Meaningful contributions. A role in the future of sustainability.
            Stay tuned for Platinum, Gold, and Silver tiers—where real impact begins.
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
