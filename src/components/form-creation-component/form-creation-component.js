import React, { useState, useEffect, useContext } from 'react'
import { Card, Form, Accordion, Button, Table, Row, Col } from 'react-bootstrap'

import './form-creation-component.css'
import '../../App.css'

import axios from 'axios'

import AuthContext from '../authentication-component/AuthContext'

async function GetProjectInformation(props) {
    console.log("authToken: ", props.authToken)
    const result = await axios({
        method: 'get',
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/meta-data",
        headers: {
            'Authorization': props.authToken
        }
    })

    console.log("response: ")
    console.log(result)
    if (result.status === 200) {
        console.log("Setting project information")
        console.log(result.data)
        props.setProjectInformation(result.data)

    }
    if (result.status === 400) {
        alert(result.data)
    }
}

async function CreateProject(authToken, projectName, projectDescription) {
    console.log(projectName)
    console.log(authToken)

    // Create project
    const projectCreationResponse = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/projects/create",
        data: {
            name: projectName,
            description: projectDescription
        },
        headers: {
            'Authorization': authToken
        }
    })

    return (projectCreationResponse)
}

async function DeleteProject(authToken, projectName) {
    console.log(projectName)
    console.log(authToken)

    // Create project
    const projectCreationResponse = await axios({
        method: "delete",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/projects/delete",
        data: {
            name: projectName
        },
        headers: {
            'Authorization': authToken
        }
    })

    return (projectCreationResponse)
}


async function CreateForm(authToken, projectName, formName, formVersion, formFile) {
    console.log(projectName)
    console.log(process.env.REACT_APP_AUTHENTICATOR_URL + 'api/forms/new?form_name=' + formName + '&form_version=' + formVersion + '&project_name=' + projectName + '&publish=false')


    // Create form
    const formCreationResponse = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + 'api/forms/new?form_name=' + formName + '&form_version=' + formVersion + '&project_name=' + projectName + '&publish=false',
        data: formFile,
        headers: {
            'Authorization': authToken,
            'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    })
    return (formCreationResponse)




}

async function UpdateForm(authToken, projectName, formName, formVersion, formFile) {


    // Create form
    const formCreationResponse = await axios({
        method: "post",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + 'api/forms/new-draft?form_name=' + formName + '&form_version=' + formVersion + '&project_name=' + projectName + '&publish=false',
        data: formFile,
        headers: {
            'Authorization': authToken,
            'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    })
    return (formCreationResponse)
}



function CreateProjectForm(props) {
    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control type="text" onChange={(event) => {
                        props.setNewProjectName(event.target.value)
                    }} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(event) => {
                        props.setNewProjectDescription(event.target.value)
                    }} />
                </Form.Group>

            </Form>
            <Button style={{ "text-align": "right" }} onClick={async () => {
                await CreateProject(props.authToken, props.newProjectName, props.newProjectDescription)
                await props.GetProjectInformation({ authToken: props.authToken, setProjectInformation: props.setProjectInformation })


            }}>Add project</Button>
        </>
    )
}

function NewFormEntry(props) {

    console.log(props.data)
    let projectList = ["No Projects"]
    let disabled = true

    if (props.data !== undefined & props.data !== null) {
        if (props.data.projects !== undefined) {
            projectList = props.data.projects.map((project) => {
                return project.name
            })
            disabled = false
        }

        if (props.data.projects.length === 0) {
            projectList = ["No Projects"]
            disabled = true

        }
    }
    console.log(projectList)

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>
                        Select a Project
                    </Form.Label>
                    <Form.Select defaultValue="Select a Project" onChange={(event) => { props.setSelectedProject(event.target.value) }} disabled={disabled} aria-label="Default select example">
                        <option disabled={true}>Select a Project</option>
                        {projectList.map((option) => {
                            return <option>{option}</option>
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Enter the name of the form
                    </Form.Label>
                    <Form.Control onChange={(event) => { props.setNewFormName(event.target.value) }} />
                    <Form.Text>This must match the "form_title" field in your xlsx form settings</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Enter the form version
                    </Form.Label>
                    <Form.Control onChange={(event) => { props.setNewFormVersion(event.target.value) }} />


                    <Form.Text>This must match the "version" field in your xlsx settings tab</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Select your file
                    </Form.Label>
                    <Form.Control type="file" size="lg" onChange={(e) => props.setSelectedFile(e.target.files[0])} />

                </Form.Group>
                <Button onClick={async () => {
                    await CreateForm(props.authToken, props.selectedProject, props.newFormName, props.newFormVersion, props.selectedFile)
                    await props.GetProjectInformation({ authToken: props.authToken, setProjectInformation: props.setProjectInformation })

                }}>Submit</Button>
            </Form>
        </>
    )
}


function NewDraftFormEntry(props) {
    console.log("Draft form data")

    const [formList, setFormList] = useState([])

    console.log(props.data)
    let projectList = ["No Projects"]
    let projectDisabled = true

    if (props.data !== undefined & props.data !== null) {
        if (props.data.projects !== undefined) {
            projectList = props.data.projects.map((project) => {
                return project.name
            })
            projectDisabled = false
        }

        if (props.data.projects.length === 0) {
            projectList = ["No Projects"]
            projectDisabled = true

        }
    }
    console.log(projectList)

    console.log(props.data)


    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>
                        Select the form you would like to update
                    </Form.Label>
                    <Form.Select defaultValue="Select a Project" onChange={(event) => {

                        props.setSelectedDraftProject(event.target.value)

                        const newFormList = []
                        if (props.data !== undefined & props.data !== null) {
                            if (props.data.forms !== undefined) {
                                props.data.forms.map((form) => {
                                    if (form.project === event.target.value) {
                                        newFormList.push(form.name)
                                    }
                                })
                                setFormList(newFormList)
                            }

                            if (props.data.projects.length === 0) {
                                setFormList([])
                            }
                        }
                    }
                    } disabled={projectDisabled} aria-label="Default select example">
                        <option disabled={true}>Select a Project</option>
                        {projectList.map((option) => {
                            return <option>{option}</option>
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Select the form you would like to update
                    </Form.Label>
                    <Form.Select defaultValue="Select a form" onChange={(event) => {
                        props.setNewDraftFormName(event.target.value)
                    }
                    } aria-label="Default select example">
                        <option disabled={true}>Select a form</option>
                        {formList.map((option) => {
                            return <option>{option}</option>
                        })}
                    </Form.Select>
                </Form.Group>


                <Form.Group>
                    <Form.Label>
                        Enter the new form version
                    </Form.Label>
                    <Form.Control onChange={(event) => { props.setNewDraftFormVersion(event.target.value) }} />


                    <Form.Text>This must match the "version" field in your xlsx settings tab, please ensure it is different to the previous version</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Select your file
                    </Form.Label>
                    <Form.Control type="file" size="lg" onChange={(e) => props.setSelectedDraftFile(e.target.files[0])} />

                </Form.Group>
                <Button onClick={async () => {
                    await UpdateForm(props.authToken, props.selectedDraftProject, props.newDraftFormName, props.newDraftFormVersion, props.selectedDraftFile)
                    await props.GetProjectInformation({ authToken: props.authToken, setProjectInformation: props.setProjectInformation })
                }}>Submit</Button>
            </Form>
        </>
    )
}


function RenderProjectInformation(props) {

    console.log(props)
    if (!props.data) {
        return (
            <div>
                <Table>
                    <thead key="table-header">
                        <tr key="table-row-1">
                            <th key="table-head-item-1">#</th>

                            <th key="table-head-item-2">Project Name</th>
                            <th key="table-head-item-3">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>No projects found</td>
                        </tr>

                    </tbody>

                </Table>
            </div>
        )
    }


    if (props.data.projects !== undefined) {
        return (
            <div>
                <Table>
                    <thead key="table-header">
                        <tr key="table-row-1">
                            <th key="table-head-item-1">#</th>

                            <th key="table-head-item-2">Project Name</th>
                            <th key="table-head-item-3">Description</th>
                        </tr>
                    </thead>
                    <tbody key="table-body">
                        {props.data.projects.map((project, index) => {
                            return (
                                <tr key={"table-row-" + index}>
                                    <td key={"table-row-" + index + "-item-1"}><Button variant="danger" onClick={async () => {
                                        await DeleteProject(props.authToken, project.name)

                                    }}>Delete</Button></td>

                                    <td key={"table-row-" + index + "-item-2"}>{project.name}</td>
                                    <td key={"table-row-" + index + "-item-3"}>{project.description}</td>
                                </tr>
                            )

                        })}

                    </tbody>
                </Table>
            </div>


        )
    }

}


async function AddAdministrator(props) {

    try {

        const result = await axios({
            url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/admin",
            method: "post",
            headers: {
                Authorization: props.authToken
            },
            data: {
                email: props.newAdmin
            }
        })

        console.log(result)

        return (result.data)
    } catch (err) {

    }

}

export default function FormCreationComponent() {



    const [authToken, setAuthToken] = useContext(AuthContext)

    const [projectInformation, setProjectInformation] = useState(null)

    const [newProjectName, setNewProjectName] = useState(null)
    const [newProjectDescription, setNewProjectDescription] = useState(null)

    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFormName, setNewFormName] = useState(null);
    const [newFormVersion, setNewFormVersion] = useState(null);


    const [selectedDraftProject, setSelectedDraftProject] = useState(null);
    const [selectedDraftFile, setSelectedDraftFile] = useState(null);
    const [newDraftFormName, setNewDraftFormName] = useState(null);
    const [newDraftFormVersion, setNewDraftFormVersion] = useState(null);


    const [newAdmin, setNewAdmin] = useState(null)

    useEffect(async () => {
        await GetProjectInformation({ authToken: authToken, setProjectInformation: setProjectInformation })
    }, [])


    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white"><h3>Creating Forms/Projects</h3></Card.Header>
                <Card.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Projects</Accordion.Header>
                            <Accordion.Body>
                                <RenderProjectInformation
                                    GetProjectInformation={GetProjectInformation}
                                    setProjectInformation={setProjectInformation}
                                    data={projectInformation}
                                    authToken={authToken} /></Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Create a Project</Accordion.Header>
                            <Accordion.Body>
                                <CreateProjectForm

                                    GetProjectInformation={GetProjectInformation}
                                    setProjectInformation={setProjectInformation}
                                    newProjectName={newProjectName}
                                    setNewProjectName={setNewProjectName}
                                    newProjectDescription={newProjectDescription}
                                    setNewProjectDescription={setNewProjectDescription}
                                    authToken={authToken} /></Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Create a Form</Accordion.Header>
                            <Accordion.Body>
                                <NewFormEntry
                                    GetProjectInformation={GetProjectInformation}
                                    setProjectInformation={setProjectInformation}
                                    authToken={authToken}
                                    data={projectInformation}
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                    setNewFormName={setNewFormName}
                                    newFormName={newFormName}
                                    setNewFormVersion={setNewFormVersion}
                                    newFormVersion={newFormVersion}
                                    setSelectedProject={setSelectedProject}
                                    selectedProject={selectedProject} />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Update Draft Form</Accordion.Header>
                            <Accordion.Body>
                                <NewDraftFormEntry
                                    GetProjectInformation={GetProjectInformation}
                                    setProjectInformation={setProjectInformation}
                                    authToken={authToken}
                                    data={projectInformation}
                                    selectedDraftFile={selectedDraftFile}
                                    setSelectedDraftFile={setSelectedDraftFile}
                                    setNewDraftFormName={setNewDraftFormName}
                                    newDraftFormName={newDraftFormName}
                                    setNewDraftFormVersion={setNewDraftFormVersion}
                                    newDraftFormVersion={newDraftFormVersion}
                                    setSelectedDraftProject={setSelectedDraftProject}
                                    selectedDraftProject={selectedDraftProject} />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Add Administrator</Accordion.Header>
                            <Accordion.Body>
                                <Form>
                                    <Row >
                                        <Col md="4">
                                            <Form.Group >
                                                <Form.Label>User Email</Form.Label>
                                                <Form.Control type="email" onChange={(event) => {
                                                    setNewAdmin(event.target.value)

                                                }} />

                                                <Button className="border-0 bg-dark" style={{ "marginTop": "10px" }}
                                                    onClick={async () => {
                                                        AddAdministrator({
                                                            authToken: authToken,
                                                            newAdmin: newAdmin
                                                        })
                                                    }}>Add User</Button>

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>


                            </Accordion.Body>
                        </Accordion.Item>




                    </Accordion>

                </Card.Body>
            </Card>
        </div >
    )
}
