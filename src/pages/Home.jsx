
import Mainnav from "../components/Mainnav"
import Sidebar from "../components/Sidebar"


const Home = () => {
  return (
    <div>
        <div className="pb-10">
            <Mainnav/>
        </div>
        <div className="flex">
      <Sidebar/>
      <div>Hello</div>
    </div>
    </div>

    
  )
}

export default Home
