import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import data from './data.json';
import ImageCarousel from './ImageCarousel';


function App() {
  console.log("App component rendering...");
  const [stages, setStages] = useState(null);
  const [selectedStage,setSelectedStage] = useState(0);
  const [selectedClass,setSelectedClass] = useState(0);

  useEffect(() => {
    setStages(data);
    console.log(`Classamity - Loaded ${Object.keys(data).length - 1} stages`);
  }, []);
  
  const createLinearGradient = (color) => {
    const match = color.match(/\d+/g);
    if (!match) return color;
    const [r, g, b] = match.map(Number);
    const darkerColor = `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`;
    return `linear-gradient(to bottom, ${color} 80%, ${darkerColor} 100%)`;
  };
  return (
    <>
      {stages && <div className='app' style={{background:createLinearGradient(stages[selectedStage].color)}}>
        <div className='stage-select'>
          <input className='stage' type='range' min={0} max={stages.length-1} value={selectedStage} onChange={(e)=>setSelectedStage(e.target.value)}></input>
          <div className='stage-title' style={{position: 'relative', left: `calc(${(selectedStage/(stages.length-1))*100}% - 200px)`}}>
            <h3>{stages[selectedStage].title}</h3>
          </div>
          <div className='stages-preview'>
              {
                stages.map((stage,index) => (
                  <img width={30} src={stage.icon}  
                  style={{position: 'absolute', left: `calc(${(index/(stages.length-1))*80}vw - 10px)`,opacity: index == selectedStage ? 1.0 : 0.5, 
                  transform: index == selectedStage && "scale(1.2)", transition: "0.5s"}}/>
                ))
              }
            </div>
        </div>
        <div className='current-stage'>
          <div className='class-select'>
            <div className={`btn ${selectedClass == 0 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(0)} style={{borderColor: "#ff7477", backgroundColor: selectedClass == 0 ? "#ff7477" : "transparent"}}>Meele</div>
            <div className={`btn ${selectedClass == 1 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(1)} style={{borderColor: "#b9fbc0", backgroundColor: selectedClass == 1 ? "#b9fbc0" : "transparent"}}>Ranged</div>
            <div className={`btn ${selectedClass == 2 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(2)} style={{borderColor: "#c8b6ff", backgroundColor: selectedClass == 2 ? "#c8b6ff" : "transparent"}}>Magic</div>
            <div className={`btn ${selectedClass == 3 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(3)} style={{borderColor: "#bde0fe", backgroundColor: selectedClass == 3 ? "#bde0fe" : "transparent"}}>Summoning</div>
            <div className={`btn ${selectedClass == 4 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(4)} style={{borderColor: "#d8dace", backgroundColor: selectedClass == 4 ? "#d8dace" : "transparent"}}>Rouge</div>
            <div className={`btn ${selectedClass == 5 ? 'selected-btn' : ''}`} onClick={()=>setSelectedClass(5)} style={{borderColor: "#e6e6fa", backgroundColor: selectedClass == 5 ? "#e6e6fa" : "transparent"}}>No Class</div>
          </div>
          <div className='build grid-container'>
            <ImageCarousel images={stages[selectedStage].classes[selectedClass].armor}  noItem={"no-armor.png"}/>
            <div className='container second-child' style={{background: stages[selectedStage].color}} data-title="Weapons">
              {stages[selectedStage].classes[selectedClass].weapons.map((weapon,index)=>(
                <div className='item' style={{animationDelay: `${index/10}s`}} key={weapon.name}>
                   <a href={weapon.link} target='blank'><img src={weapon.icon} title={weapon.name}></img></a>
                </div>
              ))}
            </div>
            <div className='container third-child'  style={{background: stages[selectedStage].color}} data-title="Accessories">
              {stages[selectedStage].classes[selectedClass].accessories.map((accessorie,index)=>(
                <div className='item' style={{animationDelay: `${index/10}s`}} key={accessorie.name}>
                   <a href={accessorie.link} target='blank'><img src={accessorie.icon} title={accessorie.name}></img></a>
                </div>
              ))}
            </div>
            <div className='container fourth-child'  style={{background: stages[selectedStage].color}} data-title="Potions, Buffs & Ammo">
              {stages[selectedStage].classes[selectedClass].buffsPotionsAmmo.map((b,index)=>(
                <div className='item' style={{animationDelay: `${index/10}s`}} key={b.name}>
                   <a href={b.link} target='blank'><img src={b.icon} title={b.name}></img></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

export default App
