import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TrackVisibility from 'react-on-screen';
import { NavBar } from './NavBar';
import 'animate.css';
import { ProjectCard } from "./ProjectCard";
import { Col, Container, Tab, Row, Nav } from "react-bootstrap";
import { NgrokUrl } from './NgrokUrl';

export const Projects2 = () => {
    const [projects, setProjects] = useState([{Titulo:"loading...", Empresa:"loading...", imgUrl:"loading...", id_objeto:"loading..."}]);
    const [userData, setUserData] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [proyecto, setProyecto] = useState(0);
    const [update, setUpdate] = useState(false);

    const {userId} = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(`https://${NgrokUrl}/api/user/${userId}`);
                console.log("UserData:", data);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const {data} = await axios.get(`https://${NgrokUrl}/api/userAndProjects/${userId}`);
                console.log("Proyectos cargados:", data);
                if (data.projects && Array.isArray(data.projects)) {
                    setProjects(data.projects);
                } else {
                    console.error("Error: 'projects' no es un array o está vacío", data);
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error fetching project data: ", error);
            }
        };

        fetchUserData();
        fetchProjects();
    }, [update, userId]);

    const handleSelectProject = async () => {
        console.log(userId, proyecto);
        const id_usuario = parseInt(userId, 10);
        const id_objeto = proyecto;
        try {
            await axios.delete(`https://${NgrokUrl}/api/EscenaObjeto`, {
                data: {
                    id_usuario: id_usuario,
                    id_objeto: id_objeto
                }
            });
            console.log("Proyecto eliminado");
            setUpdate(prev => !prev);
        } catch (error) {
            console.error('Error delete', error);
        }
    };

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const proyectoUpdate = (id) => {
        setProyecto(id);
    };

    return (
        <div>
            <NavBar />
            <section className="Project" id="projects">
                <Container>
                    <Row>
                        <Col size={12}>
                        <TrackVisibility>
                            {({ isVisible }) => (
                            <div className={isVisible ? "animate_animated animate_fadeIn" : ""}>
                              {userData && userData.username ? (
                                <>
                                    <h2>Proyectos de {userData.username}</h2>
                                    <p>Los proyectos disponibles para tu usuario son:</p>
                                </>
                                ) : null}
                                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                                    <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                        <Nav.Item>
                                            <Nav.Link eventKey="first">Tab 1</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="second">Tab 2</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="third">Tab 3</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content id="slideImUp" className={isVisible ? "animate_animated animate_slideInUp" : ""}>
                                        <Tab.Pane eventKey="first">
                                            <Row>
                                                <button onClick={handleSelectProject} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none' }}>Borrar Proyecto</button>
                                                {Array.isArray(projects) && projects.map((project) => (
                                                    <Col xs={12} sm={6} md={4} key={project.id_objeto}>
                                                        <ProjectCard {...project} />
                                                        <label>
                                                          <input
                                                              type="radio"
                                                              name="radioGroup"
                                                              value={project.Titulo}
                                                              checked={selectedValue === project.Titulo}
                                                              onChange={(e) => {
                                                                handleChange(e);
                                                                proyectoUpdate(project.id_objeto);
                                                              }}
                                                          />
                                                          {project.Titulo}
                                                        </label>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="second">
                                            <p>Agrega más proyectos</p>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="third">
                                            <p>Agrega más proyectos</p>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                            )}
                        </TrackVisibility>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};
