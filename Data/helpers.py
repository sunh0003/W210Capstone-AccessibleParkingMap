from xml.etree import ElementTree as ET
from collections import defaultdict
import os
import shutil

object_template = '''
	<object>
		<name>{name}</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>{xmin}</xmin>
			<ymin>{ymin}</ymin>
			<xmax>{xmax}</xmax>
			<ymax>{ymax}</ymax>
		</bndbox>
	</object>'''

output_template = '''
<annotation>
	<folder>{folder}</folder>
	<filename>{filename}</filename>
	<path>{fout_loc}</path>
	<source>
		<database>Unknown</database>
	</source>
	<size>
		<width>640</width>
		<height>640</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>{objects}
</annotation>'''

def split_classes(in_path, out_path):
    '''will split a multiclass pascal voc image and annotation dataset 
    into folders, named after the class, under out_path'''
    for fin in os.listdir(in_path):
        if fin.endswith('.xml'):
            fin_loc = os.path.join(in_path,fin)
            tree = ET.parse(fin_loc)
            filename = tree.find('filename').text
            boxes = tree.findall('object')
            objects = defaultdict(list)
            for box in boxes:
                args = {}
                clss = box.find('name').text
                args['name'] = clss
                bndbox = box.find('bndbox')
                args['xmin'] = bndbox.find('xmin').text
                args['ymin'] = bndbox.find('ymin').text
                args['xmax'] = bndbox.find('xmax').text
                args['ymax'] = bndbox.find('ymax').text
                objects[clss].append(object_template.format(**args))
            for clss, o_list in objects.items():
                folder = os.path.join(out_path,clss)
                fout_loc = os.path.join(folder, filename)
                try:
                    os.mkdir(folder)
                except:
                    pass
                shutil.copy(fin_loc.replace('.xml', '.jpg'), fout_loc.replace('.xml', '.jpg'))
                objs = '\n'.join(o_list)
                args = dict(folder = clss, 
                            filename=fin,
                        fout_loc = fout_loc.replace('/', '\\'),
                        objects = objs)
                with open(os.path.join(folder, fin), 'wt') as fout:
                    fout.write(output_template.format(**args))

def replace_label(path, fm, to):
    '''replaces one class label with another in a folder of pascal VOC annotations.
    for example, replace_label(path, 'lamp', 'pole')'''
    for f in os.listdir(path):
        if f.endswith('.xml'):
            with open(path+f, 'rt') as fin:
                data = fin.read()
            with open(path+f, 'wt') as fout:
                fout.write(data.replace(fm, to))