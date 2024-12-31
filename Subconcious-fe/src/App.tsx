import { Landing } from "./components/Landing"
import { Signin } from "./components/Signin"
import { Signup } from "./components/Signup"
import { Dashboard } from "./components/Dashboard"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from "recoil"
import { BrainContent } from "./components/BrainContent"
import { ErrorPage } from "./components/ErrorPage"

function App() {

  return <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path={`/api/v1/brain/:shareLink`} element={<BrainContent />}></Route>
        <Route path={`/error`} element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
}

export default App
