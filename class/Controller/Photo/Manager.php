<?php

/*
 * See docs/AUTHORS and docs/COPYRIGHT for relevant info.
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @author Matthew McNaney <mcnaney at gmail dot com>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace properties\Controller\Photo;

use properties\Resource\Photo;
use Canopy\Request;

class Manager extends User
{

    protected function deleteCommand(Request $request)
    {
        $this->checkPropertyOwnership($request->pullDeleteInteger('propertyId'),
                $this->getCurrentLoggedManager());
        $photo = $this->factory->load($this->id);
        if ($photo->cid != $this->role->getId()) {
            throw new \properties\Exception\PrivilegeMissing;
        }
        $this->factory->delete($photo);
        return array('success' => true);
    }

    protected function savePostCommand(Request $request)
    {
        $this->checkPropertyOwnership($request->pullPostInteger('propertyId'),
                $this->getCurrentLoggedManager());

        return $this->factory->post($request);
    }

    protected function jsonPatchCommand(Request $request)
    {
        $this->checkPropertyOwnership($request->pullPatchInteger('propertyId'),
                $this->getCurrentLoggedManager());
        $photo = $this->factory->load($this->id);
        $variableName = $request->pullPatchString('varname');
        switch ($variableName) {
            case 'move':
                $this->factory->sort($photo,
                        $request->pullPatchInteger('newPosition'));
                break;
        }
        return array('success' => true);
    }

    protected function rotatePutCommand(Request $request)
    {
        $photo = $this->factory->load($this->id);
        $this->factory->rotate($photo, $request->pullPutInteger('direction'));
        return array('success' => 1);
    }

}
