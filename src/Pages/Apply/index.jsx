import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { getPicnic, getStayCodes, getStayStatus, postStayStatus } from "../../Api/Apply"
import { Button } from "../../Components/Button"
import { messages } from "../../Utils/Utilities"
import { MapBox } from "../../Components/MapBox"
import { picnicType } from "../../Utils/Types"
import { Box } from "../../Components/Box"
import * as _ from "./style";

export const Apply = () => {
  const [codes, setCodes] = useState(undefined);
  const [state, setState] = useState(undefined);
  const [picnic, setPicnic] = useState(undefined);

  useEffect(() => {
    getStayCodes().then(res => { // 잔류코드 가져오기
      res.data && setCodes(res.data.codes);
    }).catch(() => toast.error(<b>{messages.stay_codes}</b>))
    getStayStatus().then(res => { // 잔류상태 가져오기
      res.data && setState(res.data.status);
    }).catch(() => toast.error(<b>{messages.stay_status}</b>))
    getPicnic().then(res => { // 외출정보 가져오기
      res.data && setPicnic(res.data);
    }).catch(() => {})
  }, [])

  const handleClick = (e) => {
    const name = e.target.className.split(" ")[2];
    if(state !== name) {
      setState(name);
      postStayStatus(name).then(() => {
        toast.success(`잔류 신청이 ${e.target.innerText}로 변경됬습니다.`)
      }).catch(() => toast.error(<b>{messages.stay_status_change}</b>))
    }
  }

  return <_.Wrapper>
    <Box>
      <h1>잔류 신청</h1>
      <_.ButtonBox>
        {
          codes && codes.map((i, j) => {
            return <Button text={i.value.replaceAll(" ", "")} key={j} id={i.name === state ? "selected" : ""} className={i.name} action={handleClick} />
          })
        }
      </_.ButtonBox>
    </Box>
    {
      picnic && <Box $rotate>
        <h1 style={{alignSelf: "start"}}>외출 안내</h1>
        {
          Object.entries(picnic).map((i, j) => {
            if(picnicType[i[0]]) {
              return <MapBox style={{justifyContent: "space-between"}} key={j}>
                <h1>{picnicType[i[0]]}</h1>
                <h2>{i[1]}</h2>
              </MapBox>
            }
          })
        }
      </Box>
    }
  </_.Wrapper>
}