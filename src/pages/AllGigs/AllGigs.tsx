import React from 'react';
import styles from './AllGigs.module.css';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import GigCard from '../../components/card/GigCard/GigCard';
import siaCrovenImg from '../../assets/Navimage/sia croven.jpg';
import Footer from '../../components/footer/Footer';

const AllGigs: React.FC = () => {

  return (
 <div className={styles.homePage}>
       <HeroSecondary />  
     
      <section className={styles.gameCardsSection}>
        <div className={styles.gameCardsContainer}>

          
          <div className={styles.gigCardsGrid}>
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
              <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />  <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
            <GigCard 
              title="Mobile App Developer"
              description="Smart contracts ensure payments are secure and transparent with immutable transaction records. I will develop your mobile application with the latest technologies."
              rating={4}
              reviewCount={127}
              userImage={siaCrovenImg}
              userName="Sia Croven"
              userRole="Freelance Developer"
              price={2000}
              currency="ETH"
              skills={["Node.js", "React", "Java"]}
              gigImage="https://via.placeholder.com/700x300"
            />
          </div>
        </div>
      </section>
     <Footer />
    </div>
  );
};


export default AllGigs;
