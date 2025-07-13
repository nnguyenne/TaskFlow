
import Avatar from '@mui/material/Avatar';
import "./Home.scss";
import { useEffect, useState } from 'react';
import { getTask } from '../../Services/TaskServices';
function Home() {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("updatedAt_desc");
  useEffect(() => {
    setSort("updatedAt_desc")
    const fetchApi = async () => {
      const result = await getTask("", 1, 5, sort)
      setData(result.data);
    }; fetchApi();
  }, [sort])
  // console.log(data);
  return (
    <>
      <div className="home__overview">
        <h2>Overview</h2>
        <div className="home__status">
          <div className="home__status--in-progress">
            <div className="home__status--total">5</div>
            <span>In Progress</span>
          </div>
          <div className="home__status--completed">
            <div className="home__status--total">12</div>
            <span>Completed</span>
          </div>
          <div className="home__status--pending">
            <div className="home__status--total">3</div>
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div className='task'>
        <h2>Recently Updated Tasks</h2>
        {data?.map(item => (
          <div className="task-item" key={item._id}>
            <div className="task-item__left">
              <h3 className="task-item__title">{item.title}</h3>
              <p className="task-item__desc">{item.description}</p>
              <div className="task-item__bottom">
                <span className="task-item__deadline">Deadline: {item.deadline.slice(0, 10)}</span>
              </div>
            </div>
            <div className="task-item__right">
              <Avatar alt="Avatar" src="" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home;