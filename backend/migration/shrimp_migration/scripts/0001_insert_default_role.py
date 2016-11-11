#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""
This migration applies default 'wheel' role.
"""


from shrimp_api import wsgi
from shrimp_common.models import db
from shrimp_common.models import generic
from shrimp_common.models import role


with wsgi.application.app_context():
    generic.configure_models(db.MongoDB())
    role.RoleModel.make_role(
        "wheel",
        [
            {"name": k, "permissions": sorted(v)}
            for k, v in role.PermissionSet.KNOWN_PERMISSIONS.items()
        ]
    )
