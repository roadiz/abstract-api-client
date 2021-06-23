import {RoadizApiNSParams, RoadizApiSearchParams, RoadizApiTagsParams} from '../types/roadiz-api'
import { HydraCollection } from '../types/hydra'
import {RoadizNodesSources, RoadizSearchResultItem, RoadizTag} from '../types/roadiz'
import { AxiosInstance, AxiosResponse } from 'axios'
import { CommonContentResponse } from "../types/common";

export default class RoadizApi {
    protected axios: AxiosInstance

    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }

    getCommonContent(params: RoadizApiNSParams): Promise<AxiosResponse<CommonContentResponse>> {
        return this.axios.get<CommonContentResponse>('/common', { params })
    }

    getNodesSources(params: RoadizApiNSParams): Promise<AxiosResponse<HydraCollection<RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizNodesSources>>(`/nodes-sources`, {
            params,
        })
    }

    getNodesSourcesByPath(path: string): Promise<AxiosResponse<RoadizNodesSources>> {
        return this.axios.get<RoadizNodesSources>('/nodes-sources/by-path', {
            params: {
                path: '/' + path || '',
            },
        })
    }

    /*
     * Returns RoadizSearchResultItem if search param is longer than 4 chars. Else return directly a RoadizNodesSources
     */
    searchNodesSourcesByPath(params: RoadizApiSearchParams): Promise<AxiosResponse<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>> {
        return this.axios.get<HydraCollection<RoadizSearchResultItem | RoadizNodesSources>>('/nodes-sources/search', {
            params,
        })
    }

    getTagsForType(type: string, params: RoadizApiTagsParams): Promise<AxiosResponse<HydraCollection<RoadizTag>>> {
        return this.axios.get<HydraCollection<RoadizTag>>(`/${type}/tags`, {
            params,
        })
    }
}
