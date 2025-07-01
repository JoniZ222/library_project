<?php

namespace App\Traits\Pagination;

use Illuminate\Http\Request;

trait Handlepagination
{
    public function getPaginationParams(Request $request)
    {
        return [
            'perPage' => $request->input('perPage', 10),
        ];
    }

    protected function buildPaginationResponse($paginatedResults, array $filters = [], array $additionalData = [], string $datakey = "data")
    {
        return array_merge([
            $datakey => $paginatedResults,
            'filters' => $filters,
            'pagination' => [
                'current_page' => $paginatedResults->currentPage(),
                'last_page' => $paginatedResults->lastPage(),
                'per_page' => $paginatedResults->perPage(),
                'total' => $paginatedResults->total(),
                'from' => $paginatedResults->firstItem(),
                'to' => $paginatedResults->lastItem(),
                'links' => $paginatedResults->links(),
            ]
        ], $additionalData);
    }
}
