import { Key, StarBorder } from '@mui/icons-material';
import { Collapse,Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import * as React from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
export interface ICategoryMenuProps {
}
interface OpenListObj  {
    [key : string] : boolean
}
export default function CategoryMenu (props: ICategoryMenuProps) {
    const data = [
        {
            Id : 1,
            level : 1,
            icon : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJUlEQVR4nO2ae4gVVRzHP0uY5PrINEsSHy2YGMHm+kcQVkuKEqj0h+QDNh9rkGIiYrkQFBj9uRsGFqnrI6UoCwkS8cFagSioqGGuQSoJC0Ubq/hord0rx74jx9k5d2buvbN7HecDP+698ztzZr53zuP3O2cgIyMjIyMjI+N/KoDtwIfcJ0wCcsA57hOWSfBnDv+LwHfAGFLCaglucvg/kn8lKWGmBB11+JfL/zUpYQBwXaLGBvifALpU5iFSwl4Jnu3w/yz/s6SE3RI0y+E/IX81KaFNgp4K8A0EOoGbwGBSQD/gL+C0w/84cAP4nhQxDKjM438M6N8bN1IFrAE2AhuAxcAQer8FJM5QYIemg5zPOoAVioGT5jn13VVJXmQ8cFHiTN/ZDLyhSOcnS/gXwIMR63wAaADOAH/HsKu61harruFAq/ztwJE8o3soJl69pIscccSvC4ArKrMz4pN+L6ClxLEtvkDkss/fpZg7Fv0U3pkKfgiJaqZY//7SCHX/rrKvqLtEtWUBglHLMv5HlFbmlGLG4gOdeAF4OEL5V1XePO1xIWW9JxGXhQ7BNi+pTEuciseqv3YDz8c473OrP99TgrcW2CyGKiysS0jw6zrPxNJPl0rwSIVu/wFPkgxxBJux5GV9TlAUltP9fapROkiwmQHmyKbnixcadMIukiOO4JUq+5YVha3XfBx0n55gv13VoNeD4ypgEvFyEPy+yprPoEGyxSH4T+Ar2WEd69bTvs0srSJ4N3MI2F+k7QM+BkYlINjVV13HV+v4MfNjUZGBQJj9AYzoY8EDddyMT/yqHyYxmFpCmwYcUN1r+1jwXdft1pckEgCv9TSXk+BcgfNiocFCIYLb1P88O1eM4PP6Uqe5N66ZqYKA+NZkWt8GPKE4gpeEjA/bChG8qshBqVOLAzb7Lf8VX6YVt0WZqKomwKoDVj4iCa4A6oEfgd8KsMPKVDyGK0X7V4HBM64LJ0AkwaVmhSo2e0BBpEpwpbVCYuLYchH8qI5fc504UasJcWm2IhqzlFMugpusCLIHgzQQmXWi2ogXMtnMJ6r0Rsg2SG8LrrMyLOPvQYXWp3IafJo1KgZhln7mWfs9/wAzQm6qtwVP0oDs2qu6I/pdCfBu8BfgG6AR2KTV/w7L36ql1DD6atCKxDhte+Sbh89qZI66fVnWgg0nVcmbChXfkcDXHHu497TgSgUQN0u4AZ1LMFmpLVbwC6rArIS4qMozqAXRrjr94WgpqC92iWqNKjCbZy7OqAX4F9RceAmFmcZKiYmrT6lu0+ViM9p6/WCdI4Cvsfr48pBtTo8aaxHuS+1A1BRhk4G51psBFyPex11Uqe/GzZwOEo35vimvVHYpIFmJhHmdYI8v6Y5ibxPvT23ULuSxIm2frp2K1yAyMjIyMjJIKbcAT2Yl33MbzdkAAAAASUVORK5CYII=',
            text : "Breakfast",
            subitems : []
        } ,
        {
            Id : 2,
            level : 1,
            icon : null,
            text : "Category 2",
            subitems : [
                {
                    level : 2,
                    icon : null,
                    text : "Category 2.1",
                },
                {
                    level : 2,
                    icon : null,
                    text : "Category 2.2",
                }
            ]
        },
        {
            Id : 3,
            level : 1,
            icon : null,
            text : "Category 3",
            subitems : []
        },
        {
            Id : 4,
            level : 1,
            icon : null,
            text : "Category 4",
            subitems : [
                {
                    level : 2,
                    icon : null,
                    text : "Category 4.1",
                },
                {
                    level : 2,
                    icon : null,
                    text : "Category 4.2",
                },
                {
                    level : 2,
                    icon : null,
                    text : "Category 4.3",
                },
                {
                    level : 2,
                    icon : null,
                    text : "Category 4.4",
                },
            ]
        },
    ]


    const [openList,setOpenList] = React.useState<OpenListObj>({});

    React.useEffect (()=> {
        var temp : OpenListObj = {}
        data.map(x => x.subitems.length ? temp[x.Id.toString()] = true : null)
        setOpenList(temp)
    }, [])

  const handleClick = (Id : any) => {
    var temp = {...openList}
    temp[Id] = !temp[Id];
    setOpenList(temp);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 280, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      className = 'ListMenu'
    //   subheader={
    //     <ListSubheader component="div" id="nested-list-subheader">
    //       Nested List Items
    //     </ListSubheader>
    //   }
    >
        {
            data.map(x => 
                x.subitems.length ? 
                <Box key={x.Id}>
                    <ListItemButton onClick={()=>handleClick(x.Id)}>
                        {x.icon && <ListItemIcon>
                            <img className='ListItemIcon' src={x.icon} />
                        </ListItemIcon>}
                        <ListItemText disableTypography primary={x.text} className="ListItemText" />
                        {openList[x.Id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openList[x.Id]} timeout="auto" unmountOnExit>
                        <List component="div" sx={{ pl : 4}} >
                            {
                                x.subitems.map((y,i) => 
                                    <ListItemButton key={i}>
                                        {y.icon && <ListItemIcon>
                                            <DraftsIcon />
                                        </ListItemIcon>}
                                        <ListItemText disableTypography className="ListItemText" primary={y.text} />
                                    </ListItemButton>
                                    )
                            }
                        </List>
                
                    </Collapse>
                </Box>
                :
                <ListItemButton key={x.Id}>
                    {x.icon && <ListItemIcon>
                        <img className='ListItemIcon' src={x.icon} />
                    </ListItemIcon>}
                    <ListItemText disableTypography className="ListItemText" primary={x.text} />
                </ListItemButton>
                )
        }
    </List>
  );
}
