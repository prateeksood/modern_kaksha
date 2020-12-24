import {Helmet} from "react-helmet";
import Slidder from '../Slidder/slidder'
import RegisterSection from '../RegisterSection/registerSection'
import SearchTutorSection from '../SearchTutorSection/searchTutorSection'
import SubjectsCarousel from '../SubjectsCarousel/subjectsCarousel'
import TopTutors from '../TopTutors/topTutors'

const HomePage= ()=> {
  return (
  
    <div >
      <Helmet>
          <title>Home | Delta Educators</title>
          <meta
              name="description"
              content="Find tutor near you. We at Delta Educators have tutors not only for subjects like Mathematics, Economics, Physics, Chemistry, Biology, Science, Social Studies, Hindi, English but also for extracurricular activities and sports."
          />
      </Helmet>
      <Slidder/>
      <RegisterSection/>
      <SearchTutorSection/>
      <SubjectsCarousel/>
      <TopTutors/>
    </div>
  );
}
export default HomePage;