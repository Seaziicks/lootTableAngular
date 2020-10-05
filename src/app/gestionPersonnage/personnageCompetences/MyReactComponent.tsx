import * as React from 'react';
import {FunctionComponent} from 'react';
import {SkillProvider, SkillTreeGroup, SkillTree, SkillType, SavedDataType} from 'beautiful-skill-tree';

import './MyReactComponent.scss';
import {ContextStorage, NodeSelectEvent} from 'beautiful-skill-tree/dist/models';
import has = Reflect.has;

export interface IMyComponentProps {
    data: SavedDataType;
    dataToDisplay: SkillType[];
    onClick?: (dataToEmit: SavedDataType) => void;
    disabled: boolean;
}

export const MyReactComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {


    const savedData: SavedDataType = props.data;

    // console.log(savedData);

    function handleSave(
        storage: ContextStorage,
        treeId: string,
        skills: SavedDataType
    ) {
        // this.savedData = skills;
        if (skills !== undefined) {
            handleClick(skills);
        }
        return storage.setItem(`skills-${treeId}`, JSON.stringify(skills));
    }

    const handleClick = (dataToEmit: SavedDataType) => {
        if (props.onClick) {
            props.onClick(dataToEmit);
        }
    };

    const data: SkillType[] = props.dataToDisplay;

    const disabledTree: boolean = props.disabled;

    let hasToBeStopped = disabledTree;

    function preventDefaultClick(e) {
        // console.log(disabledTree);
        // console.log(hasToBeStopped);
        if (false) {
            e.preventDefault();
            e.stopPropagation();
            // hasToBeStopped = false;
        }
    }

    function handleNodeSelect(event: NodeSelectEvent) {
        console.log(event);
        if (event.state === 'selected') {
            hasToBeStopped = disabledTree;
            console.log(hasToBeStopped);
            SkillTree.toString();
        }
    }

    return <div onClickCapture={preventDefaultClick}>
        <SkillProvider>
            <SkillTreeGroup theme={{
                treeBackgroundColor: 'rgba(0, 0, 0, 0.85)',
                nodeActiveBackgroundColor: 'rgba(93, 255, 60, 0.25)',
                nodeAlternativeActiveBackgroundColor: 'unset',
                nodeBackgroundColor: 'unset',
                backgroundColor: 'unset',
                nodeAlternativeFontColor: 'black',
                nodeHoverBorderColor: 'linear-gradient( to right, #c70039,#581845)',
                nodeBorderColor: 'black',
            }}>
                {() => {
                    // console.log(savedData);
                    return (
                        <SkillTree treeId='basic-birch' title='First Skill Tree' data={data} collapsible={true}
                                   handleSave={handleSave} savedData={savedData} handleNodeSelect={handleNodeSelect}/>
                    );
                }}
            </SkillTreeGroup>
        </SkillProvider>
    </div>;
};
