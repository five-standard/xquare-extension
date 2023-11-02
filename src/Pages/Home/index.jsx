import styled from "styled-components"
import { Box } from "../../components/Box"
import { useEffect, useState } from "react"
import { getTodayMeals } from "../../Api/Meal"
import { token } from "../../Utils/Atoms"
import { useRecoilValue } from "recoil"
import { getUserSimple } from "../../Api/User"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const [meals, setMeals] = useState({
    breakfast: undefined,
    lunch: undefined,
    dinner: undefined,
    breakfast_Kcal: undefined,
    lunch_Kcal: undefined,
    dinner_Kcal: undefined
  })
  const [user, setUser] = useState({
    name: "",
    good_point: 0,
    bad_point: 0,
    profile_file_name: ""
  })
  const date = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const accessToken = useRecoilValue(token);
  const navigate = useNavigate();

  useEffect(() => {
    getTodayMeals().then(res => {
      Object.keys(meals).map(key => {
        setMeals({...meals, [key]: res.data[key]})
      })
    }).catch(() => {})
    if(accessToken) {
      getUserSimple(accessToken).then(res => {
        Object.keys(user).map(key => {
          setUser({...user, [key]: res.data[key]})
        })
      }).catch(() => {})
    }
  }, [])

  return <Wrapper>
    <Box height="70px" style={{"padding-right": "20px", "cursor": `${!accessToken ? "pointer" : "default"}`}} action={() => !accessToken && navigate("/login")}>
      <ProfileBox>
        <img src={accessToken ? user.profile_file_name : "/imgs/svg/Profile.svg"} width={40} height={40} style={{"border-radius": "50px"}}/>
        {
          accessToken
          ? <DataBox>
            <h1>{user.name}</h1>
            <h2>상점 {user.good_point}점 벌점 {user.bad_point}점</h2>
          </DataBox> 
          : <h1 style={{"font-size": "20px", "color": "#5C5960"}}>로그인하세요</h1>
        }
      </ProfileBox>
    </Box>
    <Box style={{"align-items": "center", "flex-direction": "column"}}>
      <h1 style={{"align-self": "flex-start"}}>{date.getFullYear()}-{date.getMonth()+1}-{date.getDate()} ({days[date.getDay()]})</h1>
      <MealDataBox>
        <MealBox>
          <div id="title">
            <h1>아침</h1>
            {meals.breakfast_Kcal && <h3>{meals.breakfast_Kcal}</h3> }
          </div>
          <h2>{meals.breakfast
          ? meals.breakfast.map((i, k) => `${i}${k !== meals.breakfast.length-1 ? ", " : ""}`)
          : "등록된 급식이 없습니다"
          }</h2>
        </MealBox>
        <MealBox>
          <div id="title">
            <h1>점심</h1>
            {meals.lunch_Kcal && <h3>{meals.lunch_Kcal}</h3> }
          </div>
          <h2>{meals.lunch
          ? meals.lunch.map((i, k) => `${i}${k !== meals.lunch.length-1 ? ", " : ""}`)
          : "등록된 급식이 없습니다"
          }</h2>
        </MealBox>
        <MealBox>
          <div id="title">
            <h1>저녁</h1>
            {meals.dinner_Kcal && <h3>{meals.dinner_Kcal}</h3> }
          </div>
          <h2>{meals.dinner
          ? meals.dinner.map((i, k) => `${i}${k !== meals.dinner.length-1 ? ", " : ""}`)
          : "등록된 급식이 없습니다"
          }</h2>
        </MealBox>
      </MealDataBox>
    </Box>
  </Wrapper>
}

const Wrapper = styled.div`
  gap: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DataBox = styled.div`
  display: flex;
  gap: 3px;
  flex-direction: column;
`

const MealBox = styled.div`
  gap: 5px;
  width: 100%;
  min-height: 85px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background: #F9F7FA;
  border-radius: 15px;
  & > div#title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  & > h2 {
    width: 80%;
  }
`

const MealDataBox = styled.div`
  width: 100%;
  max-height: 250px;
  border-radius: 15px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`