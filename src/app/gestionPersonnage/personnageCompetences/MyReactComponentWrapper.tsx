import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy, OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {SavedDataType, SkillType} from 'beautiful-skill-tree';
import {HttpClient} from '@angular/common/http';
import {NodeState} from 'beautiful-skill-tree/dist/models';
import {ReactNode} from 'react';
import {MyReactComponent} from './MyReactComponent';
import {AuthService} from '../../auth/auth.service';
import {PersonnageService} from '../../services/personnage.service';

const containerElementName = 'myReactComponentContainer';

export interface SpecialResponse {
    status: number;
    status_message: string;
    data: any;
}

export class SavedDataTypeCompetence {
    key: string;
    optional: boolean;
    nodeState: NodeState;
}

@Component({
    selector: 'app-my-component',
    template: `<span #${containerElementName}></span>`,
    styleUrls: ['./MyReactComponent.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyComponentWrapperComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementName) containerRef: ElementRef;

    @Input() public data: SavedDataType;
    @Output() public componentClick = new EventEmitter<SavedDataType>();
    disabled: boolean;
    nbPointCompetence = 3;

    dataToDisplay: SkillType[] = [];

    constructor(private http: HttpClient,
                private authService: AuthService,
                private personnageService: PersonnageService,
                /*private competenceService: CompetenceService*/) {
        this.handleDivClicked = this.handleDivClicked.bind(this);
        this.disabled = true;
        window.React = React;
    }

    async ngOnInit() {
        const response: SpecialResponse = await this.personnageService.getCompetences(this.http, 1);
        console.log(response);
        const competences = response.data as Competence[];
        this.dataToDisplay = this.extractAllCompetences(competences);
        this.data = this.extractAllSavedDataType(competences);
        // console.log(this.dataToDisplay);
        // console.log(this.data);
        this.render();
    }

    extractAllCompetences(competencesToExtract: Competence[]): SkillType[] {
        const competences: SkillType[] = [];
        for (const competence of competencesToExtract) {
            competences.push(this.extractCompetence(competence));
        }
        return competences;
    }

    extractCompetence(competence: Competence) {
        const extractedChildren = [];
        for (const child of competence.children) {
            extractedChildren.push(this.extractCompetence(child));
        }
        const competenceContenu = this.getCompetenceContenu(competence, competence.contenu);
        const skillToExtract: SkillType = {
            children: extractedChildren,
            color: 'default',
            icon: 'assets/icones/' + competence.icone,
            id: competence.titre,
            optional: competence.optionnelle,
            title: competence.titre,
            tooltip: {
                content: competenceContenu,
            }
        };

        return skillToExtract;
    }

    getCompetenceContenu(competence: Competence, competenceContenu: CompetenceContenu[]): ReactNode {
        const reactNode = [];
        if (competence.niveau > 0) {
            reactNode.push(<span key={competence.titre + 'NiveauCompetenceAnnonceur'}
                                 className='niveauCompetenceAnnonceur'>Niveau : </span>);
            reactNode.push(<span key={competence.titre + 'NiveauCompetence'} className='niveauCompetence'>{competence.niveau}</span>);
            reactNode.push(<p key={competence.titre + 'sautDeLigne'}/>);
        }
        let index = 0;
        for (const contenu of competenceContenu) {
            if (!contenu.niveauCompetenceRequis) {
                reactNode.push(<p key={competence.titre + 'Contenu' + index} className='contenu'>{contenu.contenu}</p>);
            } else {
                reactNode.push(
                    <span key={competence.titre + 'NiveauRequis' + contenu.niveauCompetenceRequis}
                          className='niveauCompetenceRequis'><u>Niveau competence requis</u> : {contenu.niveauCompetenceRequis}</span>,
                    <br key={competence.titre + 'ContenuBr'}/>);
                if (contenu.niveauCompetenceRequis < competence.niveau) {
                    reactNode.push(<p key={competence.titre + 'NiveauRequis' + contenu.niveauCompetenceRequis + 'Contenu'}
                                      className='niveauDebloque'>{contenu.contenu}</p>);
                } else {
                    reactNode.push(<span key={competence.titre + 'NiveauRequis' + contenu.niveauCompetenceRequis + 'Contenu'}
                                         className='niveauNonDebloque'>{contenu.contenu}</span>);
                }
            }
            index++;
        }

        return reactNode;
    }

    extractAllSavedDataType(competencesToExtract: Competence[]): SavedDataType {
        const competences: SavedDataTypeCompetence[] = [];
        for (const competence of competencesToExtract) {
            const childrenData = this.extractSavedDataType(competence);
            for (const childData of childrenData) {
                competences.push(childData);
            }
        }
        // console.log(competences);
        const save: SavedDataType = {};

        for (const competence of competences) {
            save[competence.key] = {
                optional: competence.optional,
                nodeState: competence.nodeState,
            };
        }

        // console.log(save);

        return save;
    }

    extractSavedDataType(competence: Competence): SavedDataTypeCompetence[] {
        const extractedChildren: SavedDataTypeCompetence[] = [];
        for (const child of competence.children) {
            const childrenData = this.extractSavedDataType(child);
            for (const childData of childrenData) {
                extractedChildren.push(childData);
            }
        }

        const data: SavedDataTypeCompetence = {
            key: competence.titre,
            optional: competence.optionnelle,
            nodeState: competence.etat as NodeState,
        };

        extractedChildren.push(data);

        return extractedChildren;
    }

    getNodeState(nodeStateString: string): NodeState {
        return nodeStateString === 'locked' ? 'locked'
            : nodeStateString === 'unlocked' ? 'unlocked'
                : nodeStateString === 'selected' ? 'selected' : null;
    }

    public handleDivClicked(dataToEmit: SavedDataType) {
        if (this.componentClick) {
            this.isDisabled(dataToEmit);
            this.componentClick.emit(dataToEmit);
            this.render();
            // console.log(dataToEmit);
        }
    }

    isDisabled(data: SavedDataType) {
        let competence = 0;
        for (const objet of Object.keys(data)) {
            if (data[objet].nodeState === 'selected') {
                competence++;
            }
        }
        this.disabled = this.nbPointCompetence - competence < 1;
        this.disabled = true;
        // console.log(this.disabled);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.dataToDisplay && this.data && this.disabled !== undefined) {
            this.render();
        }
    }

    ngAfterViewInit() {
        // this.render();
    }

    ngOnDestroy() {
        ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
    }

    private render() {
        const {data} = this;
        const {dataToDisplay} = this;
        const {disabled} = this;

        ReactDOM.render(<div className={'i-am-classy'}>
            <MyReactComponent dataToDisplay={dataToDisplay} data={data} onClick={this.handleDivClicked} disabled={disabled}/>
        </div>, this.containerRef.nativeElement);
    }
}
